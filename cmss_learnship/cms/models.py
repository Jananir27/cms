from django.db import models


# Create your models here.
from django.db import models
from django.contrib.auth.models import User, Group

class blog(models.Model):
    title = models.CharField(
        max_length=30, null=False, blank=False, db_index=True)
    content = models.TextField()
    class Meta:
        db_table = 'blog'
