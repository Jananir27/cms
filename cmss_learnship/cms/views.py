from django.shortcuts import render

# Create your views here.
from cms.models import *
from cms.custom_decorator import check_token
import json
from django.template.loader import get_template
from django.contrib import auth
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect
import datetime
from rest_framework.decorators import api_view, renderer_classes, authentication_classes
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
import base64
from urllib.parse import urlencode
@csrf_exempt
def login(request):
    #import pdb;pdb.set_trace()
    ctx={
            'msg' : '*password incorrect'
    }
    ctx2={
            'msg':'*login expired'
    }
    username = request.POST.get('login_id', '')
    password = request.POST.get('password', '')
    full_name = request.POST.get('user_name', '')
    is_app_login = request.POST.get('app_login')
    token = request.POST.get('token', '')
    if not request.user.is_anonymous():
        base_url = '/home/'

        strr = '%s:%s' %(username, password)
        query_string = urlencode({'token':  base64.b64encode(bytes(strr, 'utf-8'))})  # 2 token=jwt-token
        url = '{}?{}'.format(base_url, query_string)
        return HttpResponseRedirect(url)
    if username and token and full_name:
        user = User.objects.filter(username=username)
        if not user:
            user = User.objects.create_user(username, '', 'Test')
            user.username = full_name
            user.save()
            user = User.objects.filter(username=username)
        if user:
            user = user[0]
            base_url = '/home/'
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            auth.login(request, user)
            strr = '%s:%s' % (username, password)
            query_string = urlencode({'token': base64.b64encode(bytes(strr, 'utf-8'))})  # 2 token=jwt-token
            url = '{}?{}'.format(base_url, query_string)
            return HttpResponseRedirect(url)
    elif username and password:
        user=User.objects.filter(username=username)
        user.backend='django.contrib.auth.backends.ModelBackend'
        user = authenticate(username=username, password=password)
        if user:
            if user and user.is_active:
                auth.login(request, user)

                if is_app_login:
                    sessionkey = request.session.session_key

                    resp = {"username": username, "sessionkey": sessionkey}

                    return HttpResponse(json.dumps(resp), content_type="application/json")
                base_url = '/home/'
                strr = '%s:%s' % (username, password)
                query_string = urlencode({'token': base64.b64encode(bytes(strr, 'utf-8'))})  # 2 token=jwt-token
                url = '{}?{}'.format(base_url, query_string)
                return HttpResponseRedirect(url)

            elif is_app_login:
                return HttpResponse(json.dumps({"error": 1, "message": "Login Failed"}),
                                           content_type="application/json",
                                           status=500)
            elif user and user.is_active==False:
                message = get_template('templates/login.html').render(ctx2)
                message = get_template('templates/login.html').render(ctx2)
                return HttpResponse(message)
        elif not user:
            message = get_template('templates/login.html').render(ctx)
            return HttpResponse(message)
    return render(request,'templates/login.html')

@csrf_exempt
def logout(request):
    auth.logout(request)
    return HttpResponseRedirect("/login/")

@authentication_classes([JSONWebTokenAuthentication])
def check_api():
    return HttpResponse("hello")

@check_token
@authentication_classes([JSONWebTokenAuthentication])
@csrf_exempt
def home(request):
    blogg=blog.objects.all()
    title_list = {}
    for i in blogg:
        title_list.setdefault(i.title, '/blog?title='+(i.title).replace(' ', '%^'))
    return render(request, 'templates/base.html', {'username': request.user.username, 'title_list': title_list, 'content': blogg[0].content})

@csrf_exempt
def blogg(request):
    #import pdb;pdb.set_trace()
    title = request.GET.get('title')
    tit = title.replace('%^', ' ')
    cont = blog.objects.get(title=tit).content
    return HttpResponse(cont)

@csrf_exempt
def create_blog(request):
    return render(request, 'templates/index.html')

@csrf_exempt
def save_blog(request):
    title = request.POST.get('title')
    content = request.POST.get('content')
    blogg_ = blog.objects.create(title=title, content=content)
    return HttpResponse('Saved successfully')