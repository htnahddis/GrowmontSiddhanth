from django.db.models import Count
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime

import openpyxl
from rest_framework.parsers import MultiPartParser
from django.http import HttpResponse

from .models import Employee, Sale, Interaction, Client
from .serializers import (
    EmployeeSerializer,
    SaleSerializer,
    InteractionSerializer,
    ClientSerializer,
)


# Health Check
@api_view(["GET"])
def health_check(request):
    return Response({
        "status": "Backend running",
        "message": "Hello from Django"
    })


# Auth Protected Test
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({
        "message": f"Hello {request.user.username}, you are authenticated"
    })


# --------------------
# Logout
# --------------------
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"detail": "Successfully logged out"},
                status=status.HTTP_205_RESET_CONTENT,
            )
        except Exception:
            return Response(
                {"error": "Invalid token"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# --------------------
# Employees APIs  ✅ NEW
# --------------------
@api_view(['GET'])
def employees_list(request):
    employees = Employee.objects.annotate(
        clients_count=Count('clients', distinct=True),
        sales_count=Count('sales', distinct=True),
        interactions_count=Count('interactions', distinct=True),
    )
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def employee_detail(request, id):
    employee = Employee.objects.annotate(
        clients_count=Count('clients', distinct=True),
        sales_count=Count('sales', distinct=True),
        interactions_count=Count('interactions', distinct=True),
    ).get(id=id)

    serializer = EmployeeSerializer(employee)
    return Response(serializer.data)


@api_view(['GET'])
def employee_clients(request, id):
    clients = Client.objects.filter(employees__id=id).distinct()
    serializer = ClientSerializer(clients, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def employee_sales(request, id):
    sales = Sale.objects.filter(sales_rep_id=id)
    serializer = SaleSerializer(sales, many=True)
    return Response(serializer.data)


# --------------------
# Existing APIs
# --------------------
@api_view(['GET'])
def sales_list(request):
    sales = Sale.objects.all()
    serializer = SaleSerializer(sales, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def interactions_list(request):
    interactions = Interaction.objects.all()
    serializer = InteractionSerializer(interactions, many=True)
    return Response(serializer.data)


# export sales 
@api_view(['GET'])
def export_sales_excel(request):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.append(['Client', 'Date', 'Contact', 'Sales Rep', 'Company', 'Amount', 'Remarks'])

    for s in Sale.objects.all():
        ws.append([
            s.client.name,
            s.date,
            s.client.contact_number,
            s.sales_rep.name,
            s.company,
            s.amount,
            s.remarks
        ])

    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename="sales.xlsx"'
    wb.save(response)
    return response

# export interactions 
@api_view(['GET'])
def export_interactions_excel(request):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.append(['Client', 'Date', 'Contact', 'Notes', 'Next Follow Up'])

    for i in Interaction.objects.all():
        ws.append([
            i.client.name,
            i.date,
            i.client.contact_number,
            i.discussion_notes,
            i.next_follow_up
        ])

    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename="interactions.xlsx"'
    wb.save(response)
    return response



# import sales 
@api_view(['POST'])
@parser_classes([MultiPartParser])
def import_sales_excel(request):
    wb = openpyxl.load_workbook(request.FILES['file'])
    ws = wb.active

    for row in ws.iter_rows(min_row=2, values_only=True):
        client, date, contact, rep, company, amount, remarks = row

        client_obj, _ = Client.objects.get_or_create(
            name=client,
            contact_number=contact
        )
        rep_obj = Employee.objects.get(name=rep)

        Sale.objects.create(
            client=client_obj,
            sales_rep=rep_obj,
            date=date,
            company=company,
            amount=amount,
            remarks=remarks
        )

    return Response({'status': 'Sales imported'})


# import interactions
@api_view(['POST'])
@parser_classes([MultiPartParser])
def import_interactions_excel(request):
    wb = openpyxl.load_workbook(request.FILES['file'])
    ws = wb.active

    # TEMP: assign interactions to first employee (or manager)
    default_employee = Employee.objects.first()

    if not default_employee:
        return Response(
            {'error': 'No employee found. Create employee first.'},
            status=400
        )

    for row in ws.iter_rows(min_row=2, values_only=True):
        client, date, contact, summary, follow_up = row

        if not client:
            continue

        client_obj, _ = Client.objects.get_or_create(
            name=client,
            contact_number=contact
        )

        # Ensure date format
        if isinstance(date, datetime):
            date = date.date()
        if isinstance(follow_up, datetime):
            follow_up = follow_up.date()

        Interaction.objects.create(
            client=client_obj,
            employee=default_employee,      # ✅ REQUIRED
            date=date,
            discussion_notes=summary,
            next_follow_up=follow_up
        )

    return Response({'status': 'Interactions imported successfully'})


#create sales
@api_view(['POST'])
def create_sale(request):
    data = request.data

    client, _ = Client.objects.get_or_create(
        name=data['client'],
        contact_number=data['contactNo']
    )

    employee = Employee.objects.get(id=data['employeeId'])

    sale = Sale.objects.create(
        client=client,
        sales_rep=employee,
        date=data['date'],
        company=data['company'],
        amount=data['amount'],
        remarks=data['remark']
    )

    return Response({'id': sale.id}, status=201)


#create interactions
@api_view(['POST'])
def create_interaction(request):
    data = request.data

    client, _ = Client.objects.get_or_create(
        name=data['client'],
        contact_number=data['contactNo']
    )

    employee = Employee.objects.get(id=data['employeeId'])

    Interaction.objects.create(
        client=client,
        employee=employee,
        date=data['date'],
        discussion_notes=data['summary'],
        next_follow_up=data['followUpDate']
    )

    return Response({'status': 'created'}, status=201)

@api_view(['DELETE'])
def delete_sale(request, pk):
    Sale.objects.filter(id=pk).delete()
    return Response({'status': 'deleted'})

@api_view(['DELETE'])
def delete_interaction(request, pk):
    Interaction.objects.filter(id=pk).delete()
    return Response({'status': 'deleted'})
