from django.contrib import admin
from .models import *


class AutoModelAdmin(admin.ModelAdmin):
    list_display = ()
    search_fields = ()
    list_hide = ()
    search_exclude = ()

    def __init__(self, model, admin_site, list_hide=(), search_exclude=()):
        if self.list_hide == ():
            self.list_hide = list_hide
        if self.search_exclude == ():
            self.search_exclude = search_exclude
        if self.list_display == ():
            self.list_display = self.get_default_list_display(model)
        if self.search_fields == ():
            self.search_fields = self.get_default_search_fields(model)
        super(AutoModelAdmin, self).__init__(model, admin_site)

    def get_default_list_display(self, model):
        return [f.name for f in model._meta.fields if f.name not in self.list_hide]

    def get_default_search_fields(self, model):
        return [f.name for f in model._meta.fields if f.name not in self.search_exclude]

    @staticmethod
    def get_class(**kwargs):
        def auto_model_admin_class_generator(model, admin_site):
            return AutoModelAdmin(model, admin_site, **kwargs)

        return auto_model_admin_class_generator


admin.site.register(CampDetails, AutoModelAdmin)
admin.site.register(Camps, AutoModelAdmin)
admin.site.register(NpoMembers, AutoModelAdmin)
admin.site.register(Payments, AutoModelAdmin)
admin.site.register(Users, AutoModelAdmin.get_class(list_hide=('password',)))
