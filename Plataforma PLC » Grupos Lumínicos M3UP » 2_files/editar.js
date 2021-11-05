function Previsualizar()
{
    if (!verificarSubmit()) {
        return;
    }
    var viejo = document.record_form.action;
    document.record_form.action = document.record_form.url_previsualizar.value;
    document.record_form.target = 'previsualizar';
    DOM_OpenWindow('/', 600, 400, 'previsualizar');
    document.record_form.submit();
    document.record_form.target = '';
    document.record_form.action = viejo;
    
}
