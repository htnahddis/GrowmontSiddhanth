from rest_framework import serializers
from .models import Employee, Client, Sale, Interaction


class EmployeeSerializer(serializers.ModelSerializer):
    clients_count = serializers.IntegerField(read_only=True)
    sales_count = serializers.IntegerField(read_only=True)
    interactions_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Employee
        fields = [
            'id',
            'name',
            'email',
            'mobile_no',
            'gender',
            'dob',
            'avatar',
            'clients_count',
            'sales_count',
            'interactions_count',
        ]


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'


class SaleCreateSerializer(serializers.ModelSerializer):
    client = serializers.PrimaryKeyRelatedField(queryset=Client.objects.all())
    sales_rep = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())

    class Meta:
        model = Sale
        fields = '__all__'


class SaleSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    sales_rep = EmployeeSerializer(read_only=True)

    class Meta:
        model = Sale
        fields = '__all__'


class InteractionSerializer(serializers.ModelSerializer):
    client = ClientSerializer()
    employee = EmployeeSerializer()

    class Meta:
        model = Interaction
        fields = '__all__'
