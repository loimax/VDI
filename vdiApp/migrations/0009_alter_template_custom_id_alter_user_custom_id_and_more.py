# Generated by Django 4.2.5 on 2023-10-04 09:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vdiApp', '0008_vm_templat_id_alter_template_custom_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='template',
            name='custom_id',
            field=models.CharField(default='45029e1e-f86b-4c51-8c19-e3718a89ca09', editable=False, max_length=36, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='custom_id',
            field=models.CharField(default='826007a8-b712-49b5-9dc7-4a705b581957', editable=False, max_length=36, unique=True),
        ),
        migrations.AlterField(
            model_name='vm',
            name='custom_id',
            field=models.CharField(default='0b6cda40-6b68-456f-8088-886a60c56e71', editable=False, max_length=36, unique=True),
        ),
    ]