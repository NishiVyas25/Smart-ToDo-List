from django.contrib import admin
from .models import Task, Category, ContextEntry

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "usage_count")
    search_fields = ("name",)
    ordering = ("name",)

@admin.register(ContextEntry)
class ContextEntryAdmin(admin.ModelAdmin):
    list_display = ("id", "source", "created_at", "short_content")
    list_filter = ("source", "created_at")
    search_fields = ("content",)
    date_hierarchy = "created_at"
    readonly_fields = ("processed_insights",)

    def short_content(self, obj):
        return (obj.content[:60] + "…") if len(obj.content) > 60 else obj.content
    short_content.short_description = "content"

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "priority_score", "deadline", "status", "updated_at")
    list_filter = ("status", "category")
    search_fields = ("title", "description")
    ordering = ("-priority_score", "deadline")
