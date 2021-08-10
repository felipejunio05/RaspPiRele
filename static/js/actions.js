if ( typeof checkPing === "undefined" ) {
    var checkPing = undefined
}

$(document).ready(() => {

    $('#powerOn').on('click', () => {
        let chcked = $("input[type='checkbox']:checked")

        if ( chcked.length === 1 ) {
            let index = chcked[0].getAttribute("id").replace("DEVCK_", '')
            let idName = `#DEVTB_${index}`
            let data = {action:"ON", channel: $($(idName)[0].cells[1]).html(), operation: "relay" }

            let infoMsg = alertMsgPost('Processando...', ' Ligando o Dispositivo.', 'success')
            $("#main").prepend(infoMsg)
            $("#powerOptions").prop("disabled", true)

            $.post('/controller', {...data})
            .done(data => {
                if ( data != '0' && data != '1' ) {
                    data = JSON.parse(data)

                    $(infoMsg).remove()
                    $("#main").prepend(alertMsgPost(data.msg.title, data.msg.text, data.msg.type))
                    $("#powerOptions").prop("disabled", false)
                } else {
                    treatsPostBack(data)
                }
            })
        } else if ( chcked.length  === 0) {
            $("#main").prepend(msg("Informação", "Nenhum dispositivo foi selecionado.", "warning"))
        }
    })

    $('#powerOff').on('click', () => {
        let chcked = $("input[type='checkbox']:checked")

        if ( chcked.length === 1 ) {
            let index = chcked[0].getAttribute("id").replace("DEVCK_", '')
            let idName = `#DEVTB_${index}`
            let data = {action:"OFF", channel: $($(idName)[0].cells[1]).html(), operation: "relay" }

            let infoMsg = alertMsgPost('Processando...', ' Desligando o Dispositivo.', 'success')
            $("#main").prepend(infoMsg)
            $("#powerOptions").prop("disabled", true)

            $.post('/controller', {...data})
            .done(data => {
                if ( data != '0' ) {
                    data = JSON.parse(data)

                    $(infoMsg).remove()
                    $("#main").prepend(alertMsgPost(data.msg.title, data.msg.text, data.msg.type))
                    $("#powerOptions").prop("disabled", false)
                } else {
                    treatsPostBack(data)
                }
            })
        } else if ( chcked.length  === 0) {
            $("#main").prepend(msg("Informação", "Nenhum dispositivo foi selecionado.", "warning"))
        }
    })

    $('#add').on('click', () => {
        $.post('/controller', { pag: "0", operation: "PgDevReg"})
         .done(data => {
            if ( data != '0' && data != '1' ) {
                $('body').html(data)
                reloadScripts()
            } else {
                treatsPostBack(data)
            }
        })
    })

    $('#edit').on('click', () => {
        let chcked = $("input[type='checkbox']:checked")

        if ( chcked.length === 1 ) {
            let index = chcked[0].getAttribute("id").replace("DEVCK_", '')
            let idName = `#DEVTB_${index}`

            let data = {
                        id: index,
                        hostname: $($(idName)[0].cells[3]).html(),
                        channel: $($(idName)[0].cells[1]).html(),
                        ipAddr: $($(idName)[0].cells[4]).html(),
                        port: $($(idName)[0].cells[5]).html(),
                        operation: "PgDevReg"
            }

            $.post('/controller', { pag: "1", ...data})
            .done(data => {
                if ( data != '0' && data != '1' ) {
                    $('body').html(data)
                    reloadScripts()
                } else {
                    treatsPostBack(data)
                }
            })
        } else if ( chcked.length  === 0) {
            $("#main").prepend(msg("Informação", "Nenhum dispositivo foi selecionado.", "warning"))
        }
    })

    $('#controlUser').on('click', () => {
        $.post('/controller', { pag: "#", operation: "listUsers"})
         .done(data => {
            if ( data != '0' && data != '1' ) {
                $('body').html(data)
                reloadScripts()
            } else {
                treatsPostBack(data)
            }
        })
    })

    $('#newUser').on('click', () => {
        $.post('/controller', { pag: "0", operation: "pgUserReg"})
         .done(data => {
            if ( data != '0' && data != '1' ) {
                $('body').html(data)
                reloadScripts()
            } else {
                treatsPostBack(data)
            }
        })
    })

    $('#editUser').on('click', () => {
        let chcked = $("input[type='checkbox']:checked")

        if ( chcked.length === 1 ) {
            let index = chcked[0].getAttribute("id").replace("USRCK_", '')
            let idName = `#USRTB_${index}`

            let data = {
                        id: index,
                        ...breakName($($(idName)[0].cells[2]).html()),
                        login: $($(idName)[0].cells[3]).html(),
                        group: $($(idName)[0].cells[4]).html(),
                        status: $($(idName)[0].cells[5]).html()
            }

            $.post('/controller', { pag: "1", ...data, operation: "pgUserReg"})
             .done(data => {
                if ( data != '0' && data != '1' ) {
                    $('body').html(data)
                    reloadScripts()
                } else {
                    treatsPostBack(data)
                }
            })

        } else if ( chcked.length  === 0) {
            $("#list-user").prepend(msg("Informação", "Nenhum usuário foi selecionado.", "warning"))
        }
    })

    $('#changePswd').on('click', () => {
        $.post('/controller', { pag: "2", operation: "pgUserReg"})
            .done(data => {
                if ( data != '0' && data != '1' ) {
                    $('body').html(data)
                    reloadScripts()
            } else {
                treatsPostBack(data)
            }
        })
    })

    $('#backUsr').on('click', () => {
        $.post('/controller', { pag: "#", operation: "listUsers"})
            .done(data => {
                $('body').html(data)
                reloadScripts()
            })
    })

    $("#editUsrPg").on('click', () => {
        let data = {
                    id: $('#idusr').val(),
                    name: $('#name').val(),
                    lastname: $('#lastname').val(),
                    login: $('#login').val(),
                    password: '',
                    group: $('#grpUsr').val(),
                    status: $('#stUsr').val(),
                    operation: 'editUser'
        }

        if ( data.name != "" && data.lastname != "" && data.login != "" ) {
            $.post('/controller', { pag: "#", ...data})
             .done(data => {
                if ( data != 0 && data != 1 ) {
                    $('body').html(data)
                    reloadScripts()
                } else {
                    treatsPostBack(data)
                }
            })

        } else if ( data.name === "" ) {
             $("#reg-user").prepend(msg("Informação", "O campo nome não foi preenchido.", "warning"))
        } else if ( data.lastname === "" ){
            $("#reg-user").prepend(msg("Informação", "O campo sobrenome não foi preenchido.", "warning"))
        } else {
            $("#reg-user").prepend(msg("Informação", "O campo login não foi preenchido.", "warning"))
        }
    })

    $("#regUsrPg").on('click', () => {

        let data = {
                    name: $('#name').val(),
                    lastname: $('#lastname').val(),
                    login: $('#login').val(),
                    password: $('#passwd').val(),
                    group: $('#grpUsr').val(),
                    status:'1',
                    operation: 'regUser'
        }

        if ( data.name != "" && data.lastname != "" && data.login != "" && data.password != "" ) {
            $.post('/controller', { pag: "#", ...data})
             .done(data => {
                if ( data != 0 && data != 1 ) {
                    $('body').html(data)
                    reloadScripts()
                } else {
                    treatsPostBack(data)
                }
            })
        } else if ( data.name === "" ) {
             $("#reg-user").prepend(msg("Informação", "O campo nome não foi preenchido.", "warning"))
        } else if ( data.lastname === "" ){
            $("#reg-user").prepend(msg("Informação", "O campo sobrenome não foi preenchido.", "warning"))
        } else if ( data.login === "" ) {
            $("#reg-user").prepend(msg("Informação", "O campo login não foi preenchido.", "warning"))
        } else {
            $("#reg-user").prepend(msg("Informação", "O campo senha não foi preenchido.", "warning"))
        }
    })

    $("#chaPswdPg").on('click', () => {
        let fieldpswd = $('#passwd').val()
        let fieldOk = $('#passRepeat').val()

        if ( fieldpswd != '' && fieldOk != '' && fieldpswd === fieldOk ) {
           let data = {
                    name: '',
                    lastname: '',
                    login: '',
                    password: fieldpswd,
                    group: '',
                    operation: 'changePswd'
            }

            $.post('/controller', {...data})
             .done(data => {
                if ( data != '0' && data != '1' ) {
                    $('body').html(data)
                    reloadScripts(-1, "listDevice")
                } else {
                    treatsPostBack(data)
                }
            })
        } else if ( fieldpswd === '' && fieldOk === '' ) {
            $('#reg-user').prepend(msg("Informação", "Os campos estão vazios.", "warning"))

        } else {
            $('#reg-user').prepend(msg("Informação", "A senha e a senha de confirmação não correspondem.", "warning"))
        }
    })

    $("#regisDevice").on('click', () => {
        let data = {
            id: '',
            hostname: $('#hostname').val(),
            channel: $('#channel').val(),
            ipAddr: $('#ipaddr').val(),
            port: $('#port').val(),
            operation: 'RegDevice'
        }

        if ( data.channel != "" && data.hostname != "" ) {
            $.post('/controller', {...data})
             .done(data => {
                if ( data != '0' && data != '1' ) {
                    $('body').html(data)
                    reloadScripts(-1, "listDevice")
                } else {
                    treatsPostBack(data)
                }
            })

        } else if ( $('#hostname').val() === "" ) {
            $("#reg-dev").prepend(msg("Informação", "E necessário preencher o hostname.", "warning"))
        } else {
            $("#reg-dev").prepend(msg("Informação", "Selecione ao menos um canal.", "warning"))
        }
    })

    $("#editDevice").on('click', () => {
        let data = {
                    id: $('#_id').val(),
                    hostname: $('#hostname').val(),
                    channel: $('#channel').val(),
                    ipAddr: $('#ipaddr').val(),
                    port: $('#port').val(),
                    operation: 'editDevice'
        }

        if ( data.hostname != '' && data.channel != '' ) {
            $.post('/controller', {...data})
             .done(data => {
                if ( data != '0' && data != '1' ) {
                    $('body').html(data)
                    reloadScripts(-1, "listDevice")
                } else {
                    treatsPostBack(data)
                }
            })
        } else if ( $("#hostname") === '') {
            $("#reg-dev").prepend(msg("Informação", "E necessário preencher o hostname.", "warning"))
        } else {
            $("#reg-dev").prepend(msg("Informação", "Selecione ao menos um canal.", "warning"))
        }
    })

    $('#rem').on('click', () => {
        let chcked = $("input[type='checkbox']:checked")

        if ( chcked.length === 1 ) {
            $('#main').prepend(alertMsg("delDevice()"))

        } else if ( chcked.length  === 0) {
            $("#main").prepend(msg("Informação", "Nenhum dispositivo foi selecionado.", "warning"))
        }
    })

    $('#ExclnUser').on('click', () => {
        let chcked = $("input[type='checkbox']:checked")

        if ( chcked.length === 1 ) {
            $('#list-user').prepend(alertMsg("delUser()"))

        } else if ( chcked.length  === 0) {
            $("#list-user").prepend(msg("Informação", "Nenhum usuário foi selecionado.", "warning"))
        }
    })

    $("input[type='checkbox']").on('change', (obj) => {
        checks = $("input[type='checkbox']")

        for (let i = 0; i < checks.length; i++) {
            if ( checks[i].getAttribute('id') === obj.target.id )
                continue

            checks[i].disabled = !checks[i].disabled
        }
    })
})


function reloadScripts(option=-1, operation='') {

    if ( typeof checkPing === "undefined" && operation == 'listDevice' )
        taskPing()
    else if ( operation === '' ) {
        clearInterval(checkPing)
        checkPing = undefined
    }

    if ( option === 0 ) {
        $('body script').remove()
        $('body').append($('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>'))
    } else if ( option === 1 ) {
        $('head script').remove()
        $('head').append($('<script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>'))
        $('head').append($('<script src="/static/js/actions.js"></script>'))
    } else {
        $('head script').remove()
        $('head').append($('<script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>'))
        $('head').append($('<script src="/static/js/actions.js"></script>'))
        $('body script').remove()
        $('body').append($('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>'))
    }
}

function loadBodyHome() {
    $.post('/controller', { operation: "listDev"})
    .done(data => {
        if ( data != '0' && data != '1' ) {
            $('body').html(data)
            reloadScripts(1, "listDevice")

        } else {
            treatsPostBack(data)
        }
    })
}

function treatsPostBack(data, ret) {
    if ( data == '0') {
        $(location).attr('pathname', 'index')
    } else if (data == '1' && ret) {
        $(location).attr('pathname', 'home')
    }
}

function breakName(value) {
	let names = {name: null, lastname: null}
	let bBreak = false

    for ( let i = 0; i < value.length; i++ ) {
        if ( value.substr(i, 1) == ' ' ) {
            names['name'] = value.substr(0, i)
            names['lastname'] = value.substr(i+1, value.length)

            bBreak = true
            break
        }
    }

    if ( ! bBreak )
        names['name'] = value

	return names
}

function alertMsgPost(title, text, type) {

    let buttonClose = $($.parseHTML('<button></button>'))
                      .attr('type', 'button')
                      .attr('class', 'btn-close')
                      .attr('data-bs-dismiss', 'alert')
                      .attr('arial-label', 'Close')

    let div = $($.parseHTML('<div></div>'))
              .attr('class', `alert alert-${type} alert-dismissible fade show`)
              .attr('role', 'alert')
              .append($($.parseHTML('<strong></strong>')).html(title))
              .append(text)
              .append($(buttonClose))

    return div
}

function alertMsg(delExec) {

    let divParent = $($.parseHTML('<div></div>'))
                    .attr('class','alert alert-danger alert-dismissible fade show')
                    .attr('role', 'alert')
                    .attr('style', 'padding: 5px;font-size: 13px;position: absolute;width: 23em;margin-top: 6.5em;margin-left: 28%;margin-right: auto;z-index: 1;')
                    .append($($.parseHTML('<h5></h5>')).html('Cuidado!'))
                    .append($($.parseHTML('<p></p>')).html('Esta operação é irreversível, deseja continuar?'))
                    .append($($.parseHTML('<hr>')))


    let divChildren = $($.parseHTML('<div></div>')).attr('class', 'd-flex justify-content-center')

    let buttonConfirm = $($.parseHTML('<button></button>'))
                        .attr('onclick', delExec)
                        .attr('type', 'button')
                        .attr('class', 'btn btn-danger btn-slim me-5')
                        .attr('data-bs-dismiss', "alert")
                        .attr('aria-label', 'Close')
                        .attr('style', 'width: 6em;')
                        .html('Continuar')

    let buttonClose = $($.parseHTML('<button></button>'))
                        .attr('type', 'button')
                        .attr('class', 'btn btn-success btn-slim ms-5')
                        .attr('data-bs-dismiss', "alert")
                        .attr('aria-label', 'Close')
                        .attr('style', 'width: 6em;')
                        .html('Abortar')

    divChildren =  $(divChildren)
                    .append(buttonConfirm)
                    .append(buttonClose)

    return $(divParent).append(divChildren)
}


function msg(title, text, type) {

    let divParent = $($.parseHTML('<div></div>'))
                    .attr('class',`alert alert-${type} alert-dismissible fade show`)
                    .attr('role', 'alert')
                    .attr('style', 'padding: 5px;font-size: 13px;position: absolute;width: 23em;margin-top: 6.5em;margin-left: 28%;margin-right: auto;z-index: 1;')
                    .append($($.parseHTML('<h5></h5>')).html(title))
                    .append($($.parseHTML('<p></p>')).html(text))
                    .append($($.parseHTML('<hr>')))


    let divChildren = $($.parseHTML('<div></div>')).attr('class', 'd-flex justify-content-center')


    let buttonOK = $($.parseHTML('<button></button>'))
                        .attr('type', 'button')
                        .attr('class', 'btn btn-success btn-slim')
                        .attr('data-bs-dismiss', "alert")
                        .attr('aria-label', 'Close')
                        .attr('style', 'width: 6em;')
                        .html('OK')

    divChildren =  $(divChildren)
                    .append(buttonOK)

    return $(divParent).append(divChildren)
}

function delDevice() {
    let chcked = $("input[type='checkbox']:checked")
    let index = chcked[0].getAttribute("id").replace("DEVCK_", '')

    let data = {
                id: index,
                hostname: '',
                channel: '',
                ipAddr: '',
                operation: 'delDevice'
    }

    $.post('/controller', {...data})
    .done(data => {
        if ( data != '0' && data != '1' ) {
            $('body').html(data)
            reloadScripts()
        } else {
            treatsPostBack(data)
        }
    })
}

function delUser() {
    let chcked = $("input[type='checkbox']:checked")
    let index = chcked[0].getAttribute("id").replace("USRCK_", '')

    let data = {
                id: index,
                name: '',
                lastname: '',
                login: '',
                password: '',
                group: '',
                status: '',
                operation: 'remUser'
    }

    $.post('/controller', {...data})
    .done(data => {
        if ( data != '0' && data != '1' ) {
            $('body').html(data)
            reloadScripts()

        } else {
            treatsPostBack(data)
        }
    })
}

function taskPing() {
    checkPing = setInterval(() => {
        $("input[type='checkbox']").each((idx, obj) => {
            try {
                let index = obj.getAttribute("id").replace("DEVCK_", '')
                let TD = `#DEVTB_${index}`

                let status = $($(TD)[0].cells[2]).children()
                let data = { host: $($(TD)[0].cells[4]).html(),
                             port: $($(TD)[0].cells[5]).html(),
                             operation: 'ping' }

                $.post('/controller', {...data})
                .done(data => {
                    data = JSON.parse(data)

                    if ( data.ping ) {
                        if ( status[0].getAttribute("class").search('success') === -1 ) {
                            if ( status[0].getAttribute("class").search('danger') > -1 ) {
                                $(status[0]).attr('class', status[0].getAttribute("class").replace('danger', 'success'))
                            } else {
                                 $(status[0]).attr('class', status[0].getAttribute("class").replace('dark', 'success'))
                            }
                        }
                    } else {
                        if ( status[0].getAttribute("class").search('danger') === -1 ) {
                            if ( status[0].getAttribute("class").search('success') > -1 ) {
                                $(status[0]).attr('class', status[0].getAttribute("class").replace('success', 'danger'))
                            } else {
                                $(status[0]).attr('class', status[0].getAttribute("class").replace('dark', 'danger'))
                            }
                        } else if ( status[0].getAttribute("class").search('dark') > -1 ) {
                            $(status[0]).attr('class', status[0].getAttribute("class").replace('dark', 'danger'))
                        }
                    }
                })
            } catch(e){ }
        })
    }, 10000)
}
