# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models


class CampDetails(models.Model):
    camp_activity_time = models.CharField(max_length=7, blank=True, null=True)
    child_friendly = models.IntegerField(blank=True, null=True)
    noise_level = models.CharField(max_length=10, blank=True, null=True)
    public_activity_area_sqm = models.IntegerField(blank=True, null=True)
    public_activity_area_desc = models.TextField(blank=True, null=True)
    support_art = models.IntegerField(blank=True, null=True)
    location_comments = models.TextField(blank=True, null=True)
    camp_location_street = models.TextField(blank=True, null=True)
    camp_location_street_time = models.TextField(blank=True, null=True)
    camp_location_area = models.IntegerField(blank=True, null=True)
    camp_id = models.IntegerField(primary_key=True)
    # camp = models.ForeignKey('Camps', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'camp_details'
        verbose_name = "Camp Details"
        verbose_name_plural = verbose_name


class Camps(models.Model):
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    camp_name_he = models.CharField(unique=True, max_length=50, blank=True, null=True)
    camp_name_en = models.CharField(unique=True, max_length=50, blank=True, null=True)
    camp_desc_he = models.TextField(blank=True, null=True)
    camp_desc_en = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=14, blank=True, null=True, choices=[(c,c) for c in ('food', 'drinking/bar', 'music', 'workshops', 'art-supporting', 'other')])
    status = models.CharField(max_length=8, blank=True, null=True, choices=[(c,c) for c in ('deleted', 'open', 'closed', 'inactive')])
    enabled = models.BooleanField(default=False)
    # main_contact = models.ForeignKey('Users', models.DO_NOTHING, db_column='main_contact', blank=True, null=True)
    # moop_contact = models.ForeignKey('Users', models.DO_NOTHING, db_column='moop_contact', blank=True, null=True)
    # safety_contact = models.ForeignKey('Users', models.DO_NOTHING, db_column='safety_contact', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'camps'
        verbose_name = "Camp"


class NpoMembers(models.Model):
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, primary_key=True)
    membership_status = models.CharField(max_length=22, blank=True, null=True)
    application_date = models.DateTimeField(blank=True, null=True)
    membership_start_date = models.DateField(blank=True, null=True)
    membership_end_date = models.DateField(blank=True, null=True)
    form_previous_p = models.TextField(blank=True, null=True)
    form_future_p = models.TextField(blank=True, null=True)
    form_why_join = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'npo_members'
        verbose_name = "Npo Member"


class Payments(models.Model):
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    payment_id = models.AutoField(primary_key=True)
    private_sale_token = models.CharField(max_length=40, blank=True, null=True)
    public_sale_token = models.CharField(max_length=40, blank=True, null=True)
    url = models.CharField(max_length=256, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    payed = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'payments'
        verbose_name = "Payment"


class Users(models.Model):
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(blank=True, null=True)
    user_id = models.AutoField(primary_key=True)
    email = models.CharField(unique=True, max_length=100, blank=True, null=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    reset_password_token = models.CharField(unique=True, max_length=32, blank=True, null=True)
    reset_password_expires = models.DateTimeField(blank=True, null=True)
    email_validation_token = models.CharField(unique=True, max_length=32, blank=True, null=True)
    email_validation_expires = models.DateTimeField(blank=True, null=True)
    enabled = models.IntegerField(blank=True, null=True)
    validated = models.IntegerField(blank=True, null=True)
    roles = models.CharField(max_length=200, blank=True, null=True)
    first_name = models.CharField(max_length=64, blank=True, null=True)
    last_name = models.CharField(max_length=64, blank=True, null=True)
    gender = models.CharField(max_length=6, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    israeli_id = models.CharField(max_length=9, blank=True, null=True)
    address = models.CharField(max_length=100, blank=True, null=True)
    cell_phone = models.CharField(max_length=10, blank=True, null=True)
    extra_phone = models.CharField(max_length=10, blank=True, null=True)
    npo_member = models.IntegerField(blank=True, null=True)
    facebook_id = models.CharField(max_length=50, blank=True, null=True)
    facebook_token = models.CharField(max_length=255, blank=True, null=True)
    camp_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'
        verbose_name = "User"
