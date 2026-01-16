from django.db.models import Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Employee, Sale, Interaction, Client
from .serializers import (
    EmployeeSerializer,
    SaleSerializer,
    InteractionSerializer,
    ClientSerializer,
)


# --------------------
# Health Check
# --------------------
@api_view(["GET"])
def health_check(request):
    return Response({
        "status": "Backend running",
        "message": "Hello from Django"
    })


# --------------------
# Auth Protected Test
# --------------------
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
