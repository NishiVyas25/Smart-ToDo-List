from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)
    usage_count = models.PositiveIntegerField(default=0)
    def __str__(self): return self.name

class ContextEntry(models.Model):
    SOURCE_CHOICES = [("whatsapp","WhatsApp"),("email","Email"),("note","Note")]
    content = models.TextField()
    source = models.CharField(max_length=16, choices=SOURCE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    processed_insights = models.JSONField(default=dict, blank=True)  # keywords, sentiment, etc.

class Task(models.Model):
    STATUS = [("todo","To Do"),("scheduled", "Scheduled"),("doing","In Progress"),("done","Done")]
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL)
    priority_score = models.FloatField(default=0)   # 0..100
    deadline = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=16, choices=STATUS, default="todo")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
