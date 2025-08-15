from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task, Category, ContextEntry
from .serializers import TaskSerializer, CategorySerializer, ContextEntrySerializer
from . import ai

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by("-priority_score","deadline")
    serializer_class = TaskSerializer

    @action(detail=False, methods=["post"], url_path="ai-suggest")
    def ai_suggest(self, request):
        """
        INPUT: {title, description, category(optional), complexity(optional)}
        OUTPUT: {priority_score, deadline, category_name, enhanced_description}
        TODO: call your LLM (LM Studio/OpenAI) inside ai.py
        """
        data = request.data
        ctx = ai.analyze_context()
        score = ai.score_priority(data.get("title",""), data.get("description",""), ctx)
        deadline = ai.suggest_deadline(data.get("complexity"))
        cat = ai.suggest_category(data.get("title",""), data.get("description",""))
        enhanced = f"{data.get('description','')}\n\n[Context keywords]: {', '.join(ctx.get('keywords',[]))}"
        return Response({
            "priority_score": score,
            "deadline": deadline.isoformat(),
            "category_name": (cat.name if cat else None),
            "enhanced_description": enhanced
        })

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer

class ContextViewSet(viewsets.ModelViewSet):
    queryset = ContextEntry.objects.all().order_by("-created_at")
    serializer_class = ContextEntrySerializer
