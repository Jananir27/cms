"""cmss_learnship URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import include, url
from cms.views import login, logout, home, blogg, create_blog, save_blog, check_api
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token
urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^token-auth/', obtain_jwt_token),
    url(r'^refresh-auth/', refresh_jwt_token),
    url(r'^verify-auth/', verify_jwt_token),
    url(r'^check_api/', check_api),
    url(r'^login/$', login),
    url(r'^logout/$', logout),
    url(r'^home/$', home),
    url(r'^blog/$', blogg),
    url(r'^create/$', create_blog),
    url(r'^save/$', save_blog)
]
