from rest_framework import serializers
from .models import Task, Category, ContextEntry

class CategorySerializer(serializers.ModelSerializer):
    class Meta: model = Category; fields = "__all__"

class ContextEntrySerializer(serializers.ModelSerializer):
    class Meta: model = ContextEntry; fields = "__all__"

class TaskSerializer(serializers.ModelSerializer):
  category_name = serializers.SerializerMethodField()

  class Meta:
      model = Task
      fields = "__all__"  # includes category_name via extra field

  def get_category_name(self, obj):
      return getattr(obj.category, "name", None)