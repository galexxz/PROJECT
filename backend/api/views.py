from rest_framework.response import Response
from rest_framework import viewsets
from .models import Task, User
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        data = request.data.copy()

        accepted_by = data.get("accepted_by", None)

        if accepted_by is not None:
            try:
                user = User.objects.get(id=accepted_by)
                instance.accepted_by = user
            except User.DoesNotExist:
                pass

        for attr, value in data.items():
            if attr != "accepted_by":
                setattr(instance, attr, value)

        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)