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

    title = models.CharField(max_length=200)
    description = models.TextField()

    location = models.CharField(max_length=200, blank=True)
    deadline = models.DateTimeField(null=True, blank=True)
    urgency = models.CharField(max_length=10, choices=URGENCY_CHOICES, default='low')

    exchange_offer = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    accepted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='accepted_tasks')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title