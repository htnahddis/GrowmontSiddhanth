from django.db import models


from django.contrib.auth.models import User

# Employee Model
class Employee(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other')
    ]

    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('EMPLOYEE', 'Employee'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='employee')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='EMPLOYEE')
    
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    mobile_no = models.CharField(max_length=15)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    dob = models.DateField()
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    def __str__(self):
        return self.name


# Client Model
class Client(models.Model):
    name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15)
    employees = models.ManyToManyField(Employee, related_name="clients")

    def __str__(self):
        return self.name


# Sales Model
class Sale(models.Model):
    PRODUCT_CHOICES = [
        ('MF', 'Mutual Funds'),
        ('HI', 'Health Insurance'),
        ('GI', 'General Insurance'),
        ('LI', 'Life Insurance'),
    ]

    FREQUENCY_CHOICES = [
        ('M', 'Monthly'),
        ('Q', 'Quarterly'),
        ('Y', 'Yearly'),
    ]

    date = models.DateField()
    sales_rep = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='sales')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='sales')

    product = models.CharField(max_length=2, choices=PRODUCT_CHOICES)
    company = models.CharField(max_length=100)
    scheme = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    frequency = models.CharField(max_length=1, choices=FREQUENCY_CHOICES)
    remarks = models.TextField(blank=True)

    def __str__(self):
        return f"{self.client.name} - {self.amount}"


# Interaction Model
class Interaction(models.Model):
    date = models.DateField()
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='interactions')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='interactions')

    discussion_notes = models.TextField()
    next_follow_up = models.DateField()

    def __str__(self):
        return f"{self.client.name} - {self.date}"
