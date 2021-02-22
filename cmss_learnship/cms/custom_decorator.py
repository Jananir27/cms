from django.http import JsonResponse
import requests
from datetime import datetime, date
import traceback
import base64
import json
from cms.models import *
serverurl = 'http://127.0.0.1:8000/'
#from views import *
def check_token(f):
    #import pdb;pdb.set_trace()
    def wrap(request, *args, **kwargs):
        #import pdb;pdb.set_trace()
        if '/home/' in request.get_full_path() or True:
            no_of_days = 0
            token = request.GET.get('token', '')#request.META.get('HTTP_AUTHORIZATION', '')
            tok = token.replace('"', '')
            time_token = request.META.get('HTTP_X_REQUESTED_WITH', '')
            today_date =datetime.now().date()
            if time_token and time_token!='null' and time_token!='undefined':
               date_token = datetime.strptime(time_token, '%Y-%m-%d').date()
               no_of_days = (today_date-date_token).days
            '''
            if token:
                response = requests.post('%s%s' % (serverurl, 'verify-auth/'),
                                         json={'token': token},
                                         headers={'Content-type': 'application/json'})
            
            try:
               res= requests.get('%s%s' %(serverurl, 'check_api/'), headers={'Authorization': token})
               #res = check_api(request)
               flag=True
               #pass
            except:
               flag=False
               print(traceback.format_exc())
            '''
            if token and no_of_days>3:
               response = requests.post('%s%s' %(serverurl, 'refresh-auth/'), json={'token': tok.split(" ")[-1]}, headers={'Content-type': 'application/json'})
               res= response.json()
               token = res['token'] if response.status_code == 200 else ''
               request.META['HTTP_AUTHORIZATION'] = 'JWT %s' %(token)
               request.META['HTTP_X_REQUESTED_WITH'] = str(today_date)
               request.META['HTTP_UPDATED'] = 'updated'
               return f(request, *args, **kwargs)
            elif not token:
                userr=User.objects.filter(username=request.user)
                if userr:
                    return f(request, *args, **kwargs)
            else:
               #response_data = {'data': {},  'message': 'invalid user', 'status': 401}
               username, password = '', ''
               #response = requests.post('http://127.0.0.1:1234/token-auth/', json={'username': 'sample', 'password': 'Janani123'}, headers={'Content-type': 'application/json'})
               client_secret = request.GET.get('token')#request.META.get('HTTP_X_SIGNATURE', '')
               #if not client_secret:
                    #client_secret = 'cHJlZGlmaXhfdXNlcjpBc2RmITIzNA=='
               try:
                   if client_secret:
                       credentials = base64.b64decode(client_secret)
                       username, password = credentials.decode('utf-8').split(":")
                   else:
                       return JsonResponse({'error': 'Signature is missing'}, status=401)

                   response = requests.post('%s%s' %(serverurl, 'token-auth/'), json={'username': username, 'password': password}, headers={'Content-type': 'application/json'})
                   #if response.status_code!=200:
                   res= response.content
                   if res:
                       ress = json.loads(res.decode('utf-8'))
                   token = ress if response.status_code == 200 else ''

                   request.META['HTTP_AUTHORIZATION'] = 'JWT %s' %(token)
                   request.META['HTTP_X_REQUESTED_WITH'] = str(today_date)
                   request.META['HTTP_UPDATED']='updated'
                   return f(request, *args, **kwargs)
               except:
                   return JsonResponse({'error': 'Authentication token validation failed'}, status=401)

        return f(request, *args, **kwargs)

    wrap.__doc__ = f.__doc__
    wrap.__name__ = f.__name__
    return wrap
