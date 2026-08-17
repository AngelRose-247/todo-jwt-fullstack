from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "is_completed",
        "owner",
        "created_at",
    )

# Register your models here.
