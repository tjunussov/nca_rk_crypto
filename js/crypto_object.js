var xmlStr = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
                    "<root>\n" +
                    "<person id=\"personId\">\n" +
                    "<name>Ivan</name>\n" +
                    "<iin>123456789012</iin>\n" +
                    "</person>\n" +
                    "<company id=\"companyId\">\n" +
                    "<name>Company Name</name>\n" +
                    "<bin>123456789012</bin>\n" +
                    "</company>\n" +
                    "</root>\n";

$(document).ready(function () {
 window.document.getElementById("dateXML").value = xmlStr;
 window.document.getElementById("signatureXML").value = "Signed XML.";
 window.document.getElementById("dateXMLById").value = xmlStr;
 window.document.getElementById("signatureXMLById").value = "Signed XML.";
});

if (!$.browser.msie && !navigator.javaEnabled()) {
    setMessage("messages-response", "messages-wrapper-error", "Поддержка Java в браузере не включена! Включите или <a href=\"http://java.com/ru/download/\" target=\"blank\">установите Java</a> и вновь обратитесь к этой странице.");
} else {
    insertApplet();
    blockScreen();
}

function insertApplet() {
    document.writeln('<applet width="1" height="1"');
    document.writeln(' codebase="."');
    document.writeln(' code="kz.gov.pki.knca.applet.MainApplet"');
    document.writeln(' archive="knca_applet.jar"');
    document.writeln(' type="application/x-java-applet"');
    document.writeln(' mayscript="true"');
    document.writeln(' id="KncaApplet" name="KncaApplet">');
    document.writeln('<param name="language" value="ru">');
    document.writeln('<param name="separate_jvm" value="true">');
	document.writeln('<param name="codebase_lookup" value="false">');
    document.writeln('</applet>');
}

function AppletIsReady() {
    unBlockScreen();
    $("#appstatus").text("Applet is ready!");
}

function blockScreen() {
    $.blockUI({
        message: '<img src="js/loading.gif" /><br/>Подождите, идет загрузка Java-апплета...',
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }
    });
}

function unBlockScreen() {
    $.unblockUI();
}

            function chooseStoragePath() {
                var storageAlias = $("#storageAlias").val();
                var storagePath = $("#storagePath").val();

                if (storageAlias != "NONE") {
                    var rw = document.getElementById('KncaApplet').browseKeyStore(storageAlias, "P12", storagePath);
                    if (rw.getErrorCode() === "NONE") {
                        storagePath = rw.getResult();
                        if (storagePath !== null && storagePath !== "") {
                            $("#storagePath").val(storagePath);
                        }
                        else {
                            $("#storageAlias").val("NONE");
                            $("#storagePath").val("");
                        }
                    } else {
                        alert(rw.getErrorCode());
                        $("#storageAlias").val("NONE");
                        $("#storagePath").val("");
                    }
                }
                else {
                    var storagePath = $("#storagePath").val("");
                }
            }

            function fillKeys() {
                var storageAlias = $("#storageAlias").val();
                var storagePath = $("#storagePath").val();
                var password = $("#password").val();
                var keyType = "";
                var selected = $("input[type='radio'][name='keyType']:checked");
                if (selected.length > 0) {
                    keyType = selected.val();
                }

                if (storagePath !== null && storagePath !== "" && storageAlias !== null && storageAlias !== "") {
                    if (password !== null && password !== "") {
                        rw = document.getElementById('KncaApplet').getKeys(storageAlias, storagePath, password, keyType);
                        if (rw.getErrorCode() === "NONE") {
                            var keyListEl = document.getElementById('keys');
                            keyListEl.options.length = 0;
                            var list = rw.getResult();
                            var slotListArr = list.split("\n");
                            for (var i = 0; i < slotListArr.length; i++) {
                                if (slotListArr[i] === null || slotListArr[i] === "") {
                                    continue;
                                }
                                keyListEl.options[keyListEl.length] = new Option(slotListArr[i], i);
                            }
                            keysOptionChanged();
                        }
                        else {
                            if (rw.getErrorCode() === "WRONG_PASSWORD" && rw.getResult() > -1) {
                                alert("Неправильный пароль! Количество оставшихся попыток: " + rw.getResult());
                            } else if (rw.getErrorCode() === "WRONG_PASSWORD") {
                                alert("Неправильный пароль!");
                            } else {
                                alert(rw.getErrorCode());
                            }
                            var keyListEl = document.getElementById('keys');
                            keyListEl.options.length = 0;
                        }
                    } else {
                        alert("Введите пароль к хранилищу");
                    }
                } else {
                    alert("Не выбран хранилище!");
                }
            }

            function keysOptionChanged() {
                var str = $("#keys :selected").text();
                var alias = str.split("|")[3];
                $("#keyAlias").val(alias);
            }

            function getNotBefore() {
                var storageAlias = $("#storageAlias").val();
                var storagePath = $("#storagePath").val();
                var password = $("#password").val();
                var alias = $("#keyAlias").val();
                if (storagePath !== null && storagePath !== "" && storageAlias !== null && storageAlias !== "") {
                    if (password !== null && password !== "") {
                        if (alias !== null && alias !== "") {
                            var rw = document.getElementById('KncaApplet').getNotBefore(storageAlias, storagePath, alias, password);
                            if (rw.getErrorCode() === "NONE") {
                                $("#notbefore").val(rw.getResult());
                            }
                            else {
                                if (rw.getErrorCode() === "WRONG_PASSWORD" && rw.getResult() > -1) {
                                    alert("Неправильный пароль! Количество оставшихся попыток: " + rw.getResult());
                                } else if (rw.getErrorCode() === "WRONG_PASSWORD") {
                                    alert("Неправильный пароль!");
                                } else {
                                    alert(rw.getErrorCode());
                                }
                            }
                        }
                        else {
                            alert("Вы не выбран ключ!");
                        }
                    } else {
                        alert("Введите пароль к хранилищу");
                    }
                } else {
                    alert("Не выбран хранилище!");
                }
            }

            function getNotAfter() {
                var storageAlias = $("#storageAlias").val();
                var storagePath = $("#storagePath").val();
                var password = $("#password").val();
                var alias = $("#keyAlias").val();
                if (storagePath !== null && storagePath !== "" && storageAlias !== null && storageAlias !== "") {
                    if (password !== null && password !== "") {
                        if (alias !== null && alias !== "") {
                            var rw = document.getElementById('KncaApplet').getNotAfter(storageAlias, storagePath, alias, password);
                            if (rw.getErrorCode() === "NONE") {
                                $("#notafter").val(rw.getResult());
                            } else {
                                if (rw.getErrorCode() === "WRONG_PASSWORD" && rw.getResult() > -1) {
                                    alert("Неправильный пароль! Количество оставшихся попыток: " + rw.getResult());
                                } else if (rw.getErrorCode() === "WRONG_PASSWORD") {
                                    alert("Неправильный пароль!");
                                } else {
                                    alert(rw.getErrorCode());
                                }
                            }
                        } else {
                            alert("Вы не выбрали ключ!");
                        }
                    } else {
                        alert("Введите пароль к хранилищу");
                    }
                } else {
                    alert("Не выбран хранилище!");
                }
            }

            function getSubjectDN() {
                var storageAlias = $("#storageAlias").val();
                var storagePath = $("#storagePath").val();
                var password = $("#password").val();
                var alias = $("#keyAlias").val();
                if (storagePath !== null && storagePath !== "" && storageAlias !== null && storageAlias !== "") {
                    if (password !== null && password !== "") {
                        if (alias !== null && alias !== "") {
                            var rw = document.getElementById('KncaApplet').getSubjectDN(storageAlias, storagePath, alias, password);

                            if (rw.getErrorCode() === "NONE") {
                                $("#subjectDn").text(rw.getResult());
                            }
                            else {
                                if (rw.getErrorCode() === "WRONG_PASSWORD" && rw.getResult() > -1) {
                                    alert("Неправильный пароль! Количество оставшихся попыток: " + rw.getResult());
                                } else if (rw.getErrorCode() === "WRONG_PASSWORD") {
                                    alert("Неправильный пароль!");
                                } else {
                                    alert(rw.getErrorCode());
                                }
                            }
                        } else {
                            alert("Вы не выбрали ключ!");
                        }
                    } else {
                        alert("Введите пароль к хранилищу");
                    }
                } else {
                    alert("Не выбран хранилище!");
                }
            }

            function getIssuerDN() {
                var storageAlias = $("#storageAlias").val();
                var storagePath = $("#storagePath").val();
                var password = $("#password").val();
                var alias = $("#keyAlias").val();
                if (storagePath !== null && storagePath !== "" && storageAlias !== null && storageAlias !== "") {
                    if (password !== null && password !== "") {
                        if (alias !== null && alias !== "") {
                            var rw = document.getElementById('KncaApplet').getIssuerDN(storageAlias, storagePath, alias, password);

                            if (rw.getErrorCode() === "NONE") {
                                $("#issuerDn").text(rw.getResult());
                            }
                            else {
                                if (rw.getErrorCode() === "WRONG_PASSWORD" && rw.getResult() > -1) {
                                    alert("Неправильный пароль! Количество оставшихся попыток: " + rw.getResult());
                                } else if (rw.getErrorCode() === "WRONG_PASSWORD") {
                                    alert("Неправильный пароль!");
                                } else {
                                    alert(rw.getErrorCode());
                                }
                            }
                        }
                        else {
                            alert("Вы не выбрали ключ!");
                        }
                    } else {
                        alert("Введите пароль к хранилищу");
                    }
                } else {
                    alert("Не выбран хранилище!");
                }
            }

            function signPlainData() {
                var storageAlias = $("#storageAlias").val();
                var storagePath = $("#storagePath").val();
                var password = $("#password").val();
                var alias = $("#keyAlias").val();
                $("#identifier").text("Не проверено");
                if (storagePath !== null && storagePath !== "" && storageAlias !== null && storageAlias !== "") {
                    if (password !== null && password !== "") {
                        if (alias !== null && alias !== "") {
                            var data = $("#date").val();
                            if (data !== null && data !== "") {
                                var rw = document.getElementById('KncaApplet').signPlainData(storageAlias, storagePath, alias, password, data);
                                if (rw.getErrorCode() === "NONE") {
                                    $("#signature").text(rw.getResult());
                                }
                                else {
                                    if (rw.getErrorCode() === "WRONG_PASSWORD" && rw.getResult() > -1) {
                                        alert("Неправильный пароль! Количество оставшихся попыток: " + rw.getResult());
                                    } else if (rw.getErrorCode() === "WRONG_PASSWORD") {
                                        alert("Неправильный пароль!");
                                    } else {
                                        $("#signature").text("");
                                        alert(rw.getErrorCode());
                                    }
                                }
                            }
                            else {
                                alert("Вы не ввели данные!")
                            }
                        } else {
                            alert("Вы не выбрали ключ!");
                        }
                    } else {
                        alert("Введите пароль к хранилищу");
                    }
                } else {
                    alert("Не выбран хранилище!");
                }
            }

            function createCMSSignature() {
                var storageAlias = $("#storageAlias").val();
                var storagePath = $("#storagePath").val();
                var password = $("#password").val();
                var alias = $("#keyAlias").val();
                $("#identifierCMS").text("Не проверено");
                if (storagePath !== null && storagePath !== "" && storageAlias !== null && storageAlias !== "") {
                    if (password !== null && password !== "") {
                        if (alias !== null && alias !== "") {
                            var data = $("#dateCMS").val();
                            var flag = $("#flag").is(':checked');

                            if (data !== null && data !== "") {
                                if (flag) {
                                    var rw = document.getElementById('KncaApplet').createCMSSignature(storageAlias, storagePath, alias, password, data, true);
                                }
                                else {
                                    var rw = document.getElementById('KncaApplet').createCMSSignature(storageAlias, storagePath, alias, password, data, false);
                                }

                                if (rw.getErrorCode() === "NONE") {
                                    $("#signatureCMS").text(rw.getResult());
                                }
                                else {
                                    if (rw.getErrorCode() === "WRONG_PASSWORD" && rw.getResult() > -1) {
                                        alert("Неправильный пароль! Количество оставшихся попыток: " + rw.getResult());
                                    } else if (rw.getErrorCode() === "WRONG_PASSWORD") {
                                        alert("Неправильный пароль!");
                                    } else {
                                        $("#signatureCMS").text("");
                                        alert(rw.getErrorCode());
                                    }
                                }
                            }
                            else {
                                alert("Вы не ввели данные!");
                            }
                        } else {
                            alert("Вы не выбрали ключ!");
                        }
                    } else {
                        alert("Введите пароль к хранилищу");
                    }
                } else {
                    alert("Не выбран хранилище!");
                }
            }

            function signXml() {
                var storageAlias = $("#storageAlias").val();
                var storagePath = $("#storagePath").val();
                var password = $("#password").val();
                var alias = $("#keyAlias").val();
                $("#identifierXML").text("Не проверено");
                if (storagePath !== null && storagePath !== "" && storageAlias !== null && storageAlias !== "") {
                    if (password !== null && password !== "") {
                        if (alias !== null && alias !== "") {
                            var data = document.getElementById("dateXML").value;
                            if (data !== null && data !== "") {
                                var rw = document.getElementById('KncaApplet').signXml(storageAlias, storagePath, alias, password, data);
                                if (rw.getErrorCode() === "NONE") {
                                    document.getElementById("signatureXML").value = rw.getResult();
                                }
                                else {
                                    if (rw.getErrorCode() === "WRONG_PASSWORD" && rw.getResult() > -1) {
                                        alert("Неправильный пароль! Количество оставшихся попыток: " + rw.getResult());
                                    } else if (rw.getErrorCode() === "WRONG_PASSWORD") {
                                        alert("Неправильный пароль!");
                                    } else {
                                        document.getElementById("signatureXML").value = "";
                                        alert(rw.getErrorCode());
                                    }
                                }
                            }
                            else {
                                alert("Вы не ввели данные!");
                            }
                        } else {
                            alert("Вы не выбрали ключ!");
                        }
                    } else {
                        alert("Введите пароль к хранилищу");
                    }
                } else {
                    alert("Не выбран хранилище!");
                }
            }

            function signXmlByElementId() {
                document.getElementById("signatureXMLById").value = "";
                var storageAlias = $("#storageAlias").val();
                var storagePath = $("#storagePath").val();
                var password = $("#password").val();
                var alias = $("#keyAlias").val();
                $("#identifierXMLById").text("Не проверено");
                if (storagePath !== null && storagePath !== "" && storageAlias !== null && storageAlias !== "") {
                    if (password !== null && password !== "") {
                        if (alias !== null && alias !== "") {
                            var data = document.getElementById("dateXMLById").value;
                            var xmlElemName = $("#xmlElemName").val();
                            var xmlIdAttrName = $("#xmlIdAttrName").val();
                            var signatureParentElement = $("#signatureParentElement").val();
                            if (data !== null && data !== "" && xmlElemName !== null && xmlElemName !== ""&&
                                xmlIdAttrName !== null && xmlIdAttrName !== "") {
									var rw = document.getElementById('KncaApplet').signXmlByElementId(storageAlias, storagePath, alias, password, data, xmlElemName, xmlIdAttrName, signatureParentElement);
									if (rw.getErrorCode() === "NONE") {
										document.getElementById("signatureXMLById").value = rw.getResult();
									}
									else {
										if (rw.getErrorCode() === "WRONG_PASSWORD" && rw.getResult() > -1) {
											alert("Неправильный пароль! Количество оставшихся попыток: " + rw.getResult());
										} else if (rw.getErrorCode() === "WRONG_PASSWORD") {
											alert("Неправильный пароль!");
										} else {
											document.getElementById("signatureXMLById").value = "";
											alert(rw.getErrorCode());
										}
									}
                            }
                            else {
                                alert("Вы не ввели данные или не указали идентификатор!");
                            }
                        } else {
                            alert("Вы не выбрали ключ!");
                        }
                    } else {
                        alert("Введите пароль к хранилищу");
                    }
                } else {
                    alert("Не выбран хранилище!");
                }
            }

            function verifyXml() {
                var signature = document.getElementById("signatureXML").value;
                if (signature !== null && signature !== "") {
                    var rw = document.getElementById('KncaApplet').verifyXml(signature);
                    if (rw.getErrorCode() === "NONE") {
                        if (rw.getResult())
                        {
                            $("#identifierXML").text("Валидная подпись");
                        }
                        else {
                            $("#identifierXML").text("Неправильная подпись");
                        }
                    }
                    else {
                        if (rw.getErrorCode() === "WRONG_PASSWORD" && rw.getResult() > -1) {
                            alert("Неправильный пароль! Количество оставшихся попыток: " + rw.getResult());
                        } else if (rw.getErrorCode() === "WRONG_PASSWORD") {
                            alert("Неправильный пароль!");
                        } else {
                            $("#identifierXML").text("Неправильная подпись");
                            alert(rw.getErrorCode());
                        }
                    }
                }
                else {
                    alert("Не найден подписанный XML!");
                }
            }

            function verifyXmlById() {
                var signature = document.getElementById("signatureXMLById").value;
                var signatureParentElement = document.getElementById("signatureParentElement").value;
                var xmlIdAttrName = document.getElementById("xmlIdAttrName").value;
                if (signature !== null && signature !== "") {
                    var rw = document.getElementById('KncaApplet').verifyXml(signature, xmlIdAttrName, signatureParentElement);
                    if (rw.getErrorCode() === "NONE") {
                        if (rw.getResult())
                        {
                            $("#identifierXMLById").text("Валидная подпись");
                        }
                        else {
                            $("#identifierXMLById").text("Неправильная подпись");
                        }
                    }
                    else {
                        if (rw.getErrorCode() === "WRONG_PASSWORD" && rw.getResult() > -1) {
                            alert("Неправильный пароль! Количество оставшихся попыток: " + rw.getResult());
                        } else if (rw.getErrorCode() === "WRONG_PASSWORD") {
                            alert("Неправильный пароль!");
                        } else {
                            $("#identifierXML").text("Неправильная подпись");
                            alert(rw.getErrorCode());
                        }
                    }
                }
                else {
                    alert("Не найден подписанный XML!");
                }
            }

            function verifyPlainData() {
                var storageAlias = $("#storageAlias").val();
                var storagePath = $("#storagePath").val();
                var password = $("#password").val();
                var alias = $("#keyAlias").val();
                if (storagePath !== null && storagePath !== "" && storageAlias !== null && storageAlias !== "") {
                    if (password !== null && password !== "") {
                        if (alias !== null && alias !== "") {
                            var data = $("#date").val();
                            var signature = $("#signature").val();
                            if (data !== null && data !== "" && signature !== null && signature !== "") {
                                var rw = document.getElementById('KncaApplet').verifyPlainData(storageAlias, storagePath, alias, password, data, signature);
                                if (rw.getErrorCode() === "NONE") {
                                    if (rw.getResult())
                                    {
                                        $("#identifier").text("Валидная подпись");
                                    }
                                    else {
                                        $("#identifier").text("Неправильная подпись");
                                    }
                                } else {
                                    if (rw.getErrorCode() === "WRONG_PASSWORD" && rw.getResult() > -1) {
                                        alert("Неправильный пароль! Количество оставшихся попыток: " + rw.getResult());
                                    } else if (rw.getErrorCode() === "WRONG_PASSWORD") {
                                        alert("Неправильный пароль!");
                                    } else {
                                        alert(rw.getErrorCode());
                                    }
                                }
                            }
                            else {
                                alert("Вы не ввели данные, или подписанные данные не найдены!");
                            }
                        } else {
                            alert("Вы не выбрали ключ!");
                        }
                    } else {
                        alert("Введите пароль к хранилищу");
                    }
                } else {
                    alert("Не выбран хранилище!");
                }
            }

            function verifyCMSSignature() {
                var data = $("#dateCMS").val();
                var signatureCMS = $("#signatureCMS").val();
                if (signatureCMS !== null && signatureCMS !== "") {
                    var rw = null;
                    rw = document.getElementById('KncaApplet').verifyCMSSignature(signatureCMS, data);
                    if (rw.getErrorCode() === "NONE") {
                        if (rw.getResult())
                        {
                            $("#identifierCMS").text("Валидная подпись");
                        }
                        else {
                            $("#identifierCMS").text("Неправильная подпись");
                        }
                    } else {
                        $("#identifierCMS").text("Неправильная подпись");
                        alert(rw.getErrorCode());
                    }
                }
                else {
                    alert("Вы не ввели данные, или подписанные данные не найдены!");
                }
            }

            function getRdnByOid() {
                var storageAlias = $("#storageAlias").val();
                var storagePath = $("#storagePath").val();
                var password = $("#password").val();
                var alias = $("#keyAlias").val();
                if (storagePath !== null && storagePath !== "" && storageAlias !== null && storageAlias !== "") {
                    if (password !== null && password !== "") {
                        if (alias !== null && alias !== "") {
                            var oid = "";
                            var selected = $("input[type='radio'][name='oid']:checked");
                            if (selected.length > 0) {
                                oid = selected.val();
                            }
                            var rw = document.getElementById('KncaApplet').getRdnByOid(storageAlias, storagePath, alias, password, oid, 0);
                            if (rw.getErrorCode() === "NONE") {
                                $("#rdnvalue").val(rw.getResult());
                            }
                            else {
                                if (rw.getErrorCode() === "WRONG_PASSWORD" && rw.getResult() > -1) {
                                    alert("Неправильный пароль! Количество оставшихся попыток: " + rw.getResult());
                                } else if (rw.getErrorCode() === "WRONG_PASSWORD") {
                                    alert("Неправильный пароль!");
                                } else {
                                    $("#rdnvalue").val("RDN не найден!");
                                    alert(rw.getErrorCode());
                                }
                            }

                        } else {
                            alert("Вы не выбрали ключ!");
                        }
                    } else {
                        alert("Введите пароль к хранилищу");
                    }
                } else {
                    alert("Не выбран хранилище!");
                }
            }

            function selectFileToSign() {
                try {
                    var rw = document.getElementById('KncaApplet').showFileChooser("ALL", "");
                    if (rw.getErrorCode() === "NONE") {
                        document.getElementById("filePath").value = rw.getResult();
                    } else {
                        alert(rw.getErrorCode());
                    }
                    return;
                } catch (e) {
                    alert(e);
                }
            }

            function createCMSSignatureFromFile() {
                var storageAlias = $("#storageAlias").val();
                var storagePath = $("#storagePath").val();
                var password = $("#password").val();
                var alias = $("#keyAlias").val();
                var rw = null;


                $("#identifierCMSFile").text("Не проверено");
                if (storagePath !== null && storagePath !== "" && storageAlias !== null && storageAlias !== "") {
                    if (password !== null && password !== "") {
                        if (alias !== null && alias !== "") {

                            var filePath = $("#filePath").val();
                            var flag = $("#flagFile").is(':checked');

                            if (filePath !== null && filePath !== "") {
                                if (flag) {
                                    rw = document.getElementById('KncaApplet').createCMSSignatureFromFile(storageAlias, storagePath, alias, password, filePath, true);
                                }
                                else {
                                    rw = document.getElementById('KncaApplet').createCMSSignatureFromFile(storageAlias, storagePath, alias, password, filePath, false);
                                }

                                if (rw.getErrorCode() === "NONE") {
                                    $("#signatureCMSFile").text(rw.getResult());
                                }
                                else {
                                    if (rw.getErrorCode() === "WRONG_PASSWORD" && rw.getResult() > -1) {
                                        alert("Неправильный пароль! Количество оставшихся попыток: " + rw.getResult());
                                    } else if (rw.getErrorCode() === "WRONG_PASSWORD") {
                                        alert("Неправильный пароль!");
                                    } else {
                                        $("#signatureCMS").text("");
                                        alert(rw.getErrorCode());
                                    }
                                }
                            }
                            else {
                                alert("Вы не ввели путь к файлу");
                            }
                        } else {
                            alert("Вы не выбрали ключ!");
                        }
                    } else {
                        alert("Введите пароль к хранилищу");
                    }
                } else {
                    alert("Не выбрано хранилище!");
                }
            }

            function verifyCMSSignatureFromFile() {
                var signatureCMSFile = $("#signatureCMSFile").val();
                var filePath = $("#filePath").val();
                if (signatureCMS !== null && signatureCMS !== "") {
                    var rw = null;
                    rw = document.getElementById('KncaApplet').verifyCMSSignatureFromFile(signatureCMSFile, filePath);
                    if (rw.getErrorCode() === "NONE") {
                        if (rw.getResult())
                        {
                            $("#identifierCMSFile").text("Валидная подпись");
                        }
                        else {
                            $("#identifierCMSFile").text("Неправильная подпись");
                        }
                    } else {
                        $("#identifierCMSFile").text("Неправильная подпись");
                        alert(rw.getErrorCode());
                    }
                }
                else {
                    alert("Вы не ввели данные, или подписанные данные не найдены!");
                }
            }

            function getHash() {
                var hashAlgorithm = $("#hashAlg").val();
                var dataHash = $("#dataHash").val();
                if (dataHash !== null && dataHash !== "") {
                    var rw = null;
                    rw = document.getElementById('KncaApplet').getHash(dataHash, hashAlgorithm);
                    if (rw.getErrorCode() === "NONE") {
                        $("#hashArea").text(rw.getResult());
                    } else {
                        alert(rw.getErrorCode());
                    }
                }
                else {
                    alert("Вы не ввели данные для хеширование");
                }
            }