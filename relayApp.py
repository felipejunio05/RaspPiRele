import json

from flask import Flask
from flask import session
from flask import request
from flask import redirect
from flask import url_for
from flask import render_template

from DB import *
from Relay import Relay
from tcping import Ping
from hashlib import sha512

app = Flask(__name__)
app.secret_key = ''

switch = Relay()


@app.route('/')
def root():
    return render_template('index.html')


@app.route('/index', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/home')
def home():
    if len(session) > 0 and session['auth']:
        if session['status'] == 1:
            response = render_template('home.html')
        else:
            response = redirect(url_for('index'))
    else:
        response = redirect(url_for('index') + '?login=1')

    return response


@app.route('/controller', methods=['POST'])
def controller():
    mysql = Connection()

    u_service = UserService(mysql)
    d_service = DeviceService(mysql)

    if request.form['operation'] == 'login':
        response, info = login(mysql)

        _error = False
    else:
        auth = Authentication(session['user'], session['password'], mysql)
        info = auth.login()

        _error = True

    if info['status'] == 1 and info['group'] == 1 and (session['auth'] and (len(session) > 0 and len(request.form) > 0)):
        if request.form['operation'] == 'listDev':
            response = render_template('main.html', table=sorted(d_service.queryDev(), key=lambda e: e[-1]),
                                       group=info['group'], status=info['status'], alert='')
        elif request.form['operation'] == 'listUsers':
            response = render_template('user.html', table=u_service.queryUser(), alert='')
        elif request.form['operation'] == 'pgUserReg':
            response = render_template('userreg.html', group=info['group'], status=info['status'])
        elif request.form['operation'] == 'PgDevReg':
            response = render_template('devreg.html')
        elif request.form['operation'] == 'regUser':
            data = {key: request.form[key] for key in request.form.keys() if key != 'operation' and key != 'pag'}
            response = userBD(data, u_service, d_service, 0, info)
        elif request.form['operation'] == 'editUser':
            data = {key: request.form[key] for key in request.form.keys() if key != 'operation' and key != 'pag'}
            response = userBD(data, u_service, d_service, 1, info)
        elif request.form['operation'] == 'changePswd':
            data = {key: request.form[key] for key in request.form.keys() if key != 'operation' and key != 'pag'}
            data['id'] = info['id']
            response = userBD(data, u_service, d_service, 2, info)
        elif request.form['operation'] == 'remUser':
            data = {key: request.form[key] for key in request.form.keys() if key != 'operation' and key != 'pag'}
            response = userBD(data, u_service, d_service, 3, info)
        elif request.form['operation'] == 'RegDevice':
            data = {key: request.form[key] for key in request.form.keys() if key != 'operation' and key != 'pag'}
            response = deviceBD(data, d_service, 0, info)
        elif request.form['operation'] == 'editDevice':
            data = {key: request.form[key] for key in request.form.keys() if key != 'operation' and key != 'pag'}
            response = deviceBD(data, d_service, 1, info)
        elif request.form['operation'] == 'delDevice':
            data = {key: request.form[key] for key in request.form.keys() if key != 'operation' and key != 'pag'}
            response = deviceBD(data, d_service, 2, info)
        elif request.form['operation'] == 'relay':
            response = relay()
        elif request.form['operation'] == 'ping':
            response = testPing(request.form['host'], request.form['port'])

    elif info['status'] == 1 and info['group'] == 2 and (session['auth'] and (len(session) > 0 and len(request.form) > 0)):
        if request.form['operation'] == 'login':
            pass
        elif request.form['operation'] == 'listDev':
            response = render_template('main.html', table=sorted(d_service.queryDev(), key=lambda e: e[-1]), group=info['group'], status=info['status'], alert='')
        elif request.form['operation'] == 'pgUserReg' and request.form['pag'] == '2':
            response = render_template('userreg.html', group=info['group'], status=info['status'])
        elif request.form['operation'] == 'changePswd':
            data = {key: request.form[key] for key in request.form.keys() if key != 'operation' and key != 'pag'}
            data['id'] = info['id']

            response = userBD(data, u_service, d_service, 2, info)
        elif request.form['operation'] == 'relay':
            response = relay()
        elif request.form['operation'] == 'ping':
            response = testPing(request.form['host'], request.form['port'])
        else:
            response = '1'
    elif info['status'] is None and request.form['operation'] == 'login':
        pass
    elif info['status'] is None or (info['status'] == 2 and request.form['operation'] != 'login'):
        response = '0'
    elif _error:
        response = render_template('error.html')

    mysql.close()

    return response


def deviceBD(data, d_service, option, info=None):
    try:
        device = Device(**data)

        if option == 0:
            if d_service.createDev(device) == 0:
                response = render_template('main.html', table=sorted(d_service.queryDev(), key=lambda e: e[-1]), group=info['group'], status=info['status'], alert=alert(0))
            else:
                response = render_template('main.html', table=sorted(d_service.queryDev(), key=lambda e: e[-1]), group=info['group'], status=info['status'], alert=alert(1, "O Modulo relé suporta somente 3 dispostivos."))
        elif option == 1:
            d_service.editDev(device)
            response = render_template('main.html', table=sorted(d_service.queryDev(), key=lambda e: e[-1]), group=info['group'], status=info['status'], alert=alert(0))
        elif option == 2:
            d_service.remDev(device)
            response = render_template('main.html', table=sorted(d_service.queryDev(), key=lambda e: e[-1]), group=info['group'], status=info['status'], alert=alert(0))

    except Exception as Error:
        response = render_template('main.html', table=sorted(d_service.queryDev(), key=lambda e: e[-1]), group=info['group'], status=info['status'], alert=alert(1, str(Error)))

    return response


def userBD(data, u_service, d_service, option, info=None):
    try:
        user = User(**data)

        if option == 0:
            u_service.createUser(user)
            response = render_template('user.html', table=u_service.queryUser(), alert=alert(0))
        elif option == 1:
            u_service.editUser(user)
            response = render_template('user.html', table=u_service.queryUser(), group=info['group'], status=info['status'], alert=alert(0))
        elif option == 2:
            u_service.changePswd(user)
            response = render_template('main.html', table=sorted(d_service.queryDev(), key=lambda e: e[-1]), group=info['group'], status=info['status'], alert=alert(0))
        elif option == 3:
            u_service.remUser(user)
            response = render_template('user.html', table=u_service.queryUser(), group=info['group'], status=info['status'], alert=alert(0))
    except Exception as Error:
        if option == 0 or option == 1 or option == 3:
            response = render_template('user.html', table=u_service.queryUser(), alert=alert(1, str(Error)))
        else:
            response = render_template('main.html', table=sorted(d_service.queryDev(), key=lambda e: e[-1]), group=info['group'], status=info['status'], alert=alert(1, str(Error)))

    return response


def login(mysql):
    session['user'] = request.form['login']
    session['password'] = sha512(request.form['password'].encode()).hexdigest()

    auth = Authentication(session['user'], session['password'], mysql)
    info = auth.login()

    for key in info.keys():
        session[key] = info[key]

    if info['auth'] and info['status']:
        response = redirect(url_for('home'))
    else:
        response = redirect(url_for('index') + '?login=0')

    return response, info


@app.route('/logout', methods=['GET'])
def logout():
    session['auth'] = False

    return redirect(url_for('index'))


def relay():
    try:
        if request.form['action'] == 'ON':
            switch.action(int(request.form['channel']))
            response = {"msg": {"title": "Sucesso!", "text": " A ação de ligar foi executado com sucesso...", "type": "success"}}

        elif request.form['action'] == 'OFF':
            switch.action(int(request.form['channel']), 5)
            response = {"msg": {"title": "Sucesso!", "text": " A ação de desligar foi executado com sucesso...", "type": "success"}}

    except Exception as Error:
        if request.form['channel'] != '':
            if not switch.status(int(request.form['channel'])):
                switch.reset(request.form['channel'])

        response = {"msg": {"title": "Erro: ", "text": " " + str(Error), "type": "warning"}}

    return json.dumps(response)


def alert(info, text=''):
    html = None

    if info == 0:
        html = """
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                  <strong>Sucesso!</strong> Operação realizada com sucesso...
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>\n
        """
    elif info == 1:
        html = """
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>Falha!</strong> Operação não foi concluida... {}
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>\n
        """.format("Erro: " + text)

    return html


def testPing(host, port):
    try:
        ping = Ping(host, port, 2)
        _ = ping.ping(2)

        response = True
    except OSError as Error:
        response = False
    except ValueError as Error:
        response = False

    return json.dumps({"ping": response})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="80")
