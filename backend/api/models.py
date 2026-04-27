from django.db import models


# 👇 USER MUST BE FIRST
class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()

    def __str__(self):
        return self.name


# 👇 TASK COMES AFTER USER
class Task(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
    ]

    URGENCY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    CATEGORY_CHOICES = [
        ('errands', 'Errands'),
        ('delivery', 'Delivery'),
        ('school_help', 'School Help'),
        ('emergency', 'Emergency Help'),
        ('tech_support', 'Tech Support'),
        ('household', 'Household Help'),
        ('others', 'Others'),
    ]

    # ✅ CATEGORY
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='others'
    )

    # 🟣 NEW BARANGAY FIELD
    BARANGAY_CHOICES = [
        ('brgy1', 'Barangay 1 (Pob.)'),
        ('brgy2', 'Barangay 2 (Pob.)'),
        ('brgy3', 'Barangay 3 (Pob.)'),
        ('brgy4', 'Barangay 4 (Pob.)'),
        ('brgy5', 'Barangay 5 (Pob.)'),
        ('brgy6', 'Barangay 6 (Pob.)'),
        ('brgy7', 'Barangay 7 (Pob.)'),
        ('brgy8', 'Barangay 8 (Pob.)'),
        ('brgy9', 'Barangay 9 (Pob.)'),
        ('brgy10', 'Barangay 10 (Pob.)'),
        ('brgy11', 'Barangay 11 (Pob.)'),
        ('brgy12', 'Barangay 12 (Pob.)'),
        ('brgy13', 'Barangay 13 (Pob.)'),
        ('brgy14', 'Barangay 14 (Pob.)'),
        ('bocohan', 'Bocohan'),
        ('cotta', 'Cotta'),
        ('dalahican', 'Dalahican'),
        ('gulang', 'Gulang-Gulang'),
        ('ibabang_dup', 'Ibabang Dupay'),
        ('ibabang_iyam', 'Ibabang Iyam'),
        ('ibabang_talim', 'Ibabang Talim'),
        ('ilayang_dup', 'Ilayang Dupay'),
        ('ilayang_iyam', 'Ilayang Iyam'),
        ('ilayang_talim', 'Ilayang Talim'),
        ('isabang', 'Isabang'),
        ('mayao_castillo', 'Mayao Castillo'),
        ('mayao_crossing', 'Mayao Crossing'),
        ('mayao_kanluran', 'Mayao Kanluran'),
        ('mayao_parada', 'Mayao Parada'),
        ('mayao_silangan', 'Mayao Silangan'),
        ('ransohan', 'Ransohan'),
        ('salinas', 'Salinas'),
        ('talao', 'Talao-Talao'),
    ]

    barangay = models.CharField(
        max_length=50,
        choices=BARANGAY_CHOICES,
        default='brgy1'
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    location = models.CharField(max_length=200, blank=True)
    deadline = models.DateTimeField(null=True, blank=True)
    urgency = models.CharField(max_length=10, choices=URGENCY_CHOICES, default='low')

    exchange_offer = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    accepted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='accepted_tasks'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title