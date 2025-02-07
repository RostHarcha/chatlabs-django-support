from django.db import models

# Create your models here.
class MyUser(models.Model):
    telegram_id = models.BigIntegerField(
        primary_key=True,
        unique=True,
    )