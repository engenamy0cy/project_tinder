from rest_framework import viewsets
from .models import Email, Is_verifed, Is_online, Created_at, Updated_at, Last_activity
from .serializers import EmailSerializers, Is_verifedSerializers, Is_onlineSerializers, Created_atSerializers, Updated_atSerializers, Last_activitySerializers

class EmailViewSet(viewsets.ModelViewSet):
    queryset = Email.objects.all()
    serializer_class = EmailSerializers

class Is_VerifedViewSet(viewsets.ModelViewSet):
    queryset = Is_verifed.objects.all()
    serializer_class = Is_verifedSerializers

class Is_OnlineViewSet(viewsets.ModelViewSet):
    queryset = Is_online.objects.all()
    serializer_class = Is_onlineSerializers

class Created_atViewSet(viewsets.ModelViewSet):
    queryset = Created_at.objects.all()
    serializer_class = Created_atSerializers

class Updated_atViewSet(viewsets.ModelViewSet):
    queryset = Updated_at.objects.all()
    serializer_class = Updated_atSerializers

class Last_activiryViewSet(viewsets.ModelViewSet):
    queryset = Last_activity.objects.all()
    serializer_class = Last_activitySerializers
