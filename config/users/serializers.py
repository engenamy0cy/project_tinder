from rest_framework import serializers
from .models import Email, Is_online, Is_verifed, Created_at, Updated_at, Last_activity, User

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

class User(serializers.ModelSerializer):
    email = serializers.CharField(source = 'email.name', read_only = True)
    is_verified = serializers.CharField(source = 'is_verified.name', read_only = True)
    is_online = serializers.CharField(source = 'is_online', read_only = True)
    created_at = serializers.CharField(source = 'created_at.name', read_only = True)
    updated_at = serializers.CharField(source = 'updated_at.name', read_only = True)
    last_activity = serializers.CharField(source = 'last_activity.name', read_only = True)
    class Meta:
        model = User
        fields = '__all__'
