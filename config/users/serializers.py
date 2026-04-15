from rest_framework import serializers
from .models import Email, Is_online, Is_verifed, Created_at, Updated_at, Last_activity

class EmailSerializers(serializers.ModelSerializer):
    class Meta:
        model = Email
        fields = '__all__'

class Is_verifedSerializers(serializers.ModelSerializer):
    class Meta:
        model = Is_verifed
        fields = '__all__'

class Is_onlineSerializers(serializers.ModelSerializer):
    class Meta:
        model = Is_online
        fields = '__all__'

class Created_atSerializers(serializers.ModelSerializer):
    class Meta:
        model = Created_at
        fields = '__all__'

class Updated_atSerializers(serializers.ModelSerializer):
    class Meta:
        model = Updated_at
        fields = '__all__'

class Last_activitySerializers(serializers.ModelSerializer):
    class Meta:
        model = Last_activity
        fields = '__all__'


