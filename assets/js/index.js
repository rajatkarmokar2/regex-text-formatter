const domNode = {
    form: {
        input_trim: document.querySelector( '#input_trim' ),
        input_remove_more_than_one_space: document.querySelector( '#input_remove_more_than_one_space' ),
        input_remove_more_than_one_new_line: document.querySelector( '#input_remove_more_than_one_new_line' ),
        input_roman_numbers: document.querySelector( '#input_roman_numbers' ),
        input_numbers: document.querySelector( '#input_numbers' ),
        input_alphabet: document.querySelector( '#input_alphabet' ),
        button_reset: document.querySelector( '#button_reset' ),
        button_apply: document.querySelector( '#button_apply' ),
    },
    input_search: document.querySelector( '#input_search' ),
    search_traverse: document.querySelector( '#search_traverse' ),
    original_text: document.querySelector( '#original_text' ),
    button_copy_formatted_text: document.querySelector( '#button_copy_formatted_text' ),
    formatted_text: document.querySelector( '#formatted_text' ),
}


function uuidv4 () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace( /[xy]/g,function ( c ) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : ( r & 0x3 | 0x8 );
            return v.toString( 16 );
        } );
}

domNode.form.button_apply.addEventListener( 'click',onApply )
function onApply () {
    const trim = domNode.form.input_trim.checked
    const remove_more_than_one_space = domNode.form.input_remove_more_than_one_space.checked
    const input_remove_more_than_one_new_line = domNode.form.input_remove_more_than_one_new_line.checked
    const input_roman_numbers = domNode.form.input_roman_numbers.checked
    const input_numbers = domNode.form.input_numbers.checked
    const input_alphabet = domNode.form.input_alphabet.checked
    let result = domNode.original_text.value
    if ( trim ) result = result.trim()
    let multiNewLineid = uuidv4()
    result = result.replace( /\n{2,}/g,`\n${multiNewLineid}\n` ) //encode more than 2 new line
    if ( remove_more_than_one_space ) {
        result = result.replace( /^\s*/gm,`` ) //remove space at start of every line
        result = result.replace( /\s{2,}(?!\n+)/g,` ` ) //remove more than 2 space 
    }
    if ( input_remove_more_than_one_new_line ) {
        result = result.replace( new RegExp( `\n*${multiNewLineid}\n*`,'g' ),'\n' ) //decode more than 2 new line
    }
    if ( input_roman_numbers ) {
        result = result.replace( /\s(?=[x|v|i]+\))/gi,`\n` )
        result = result.replace( /(?<=[x|v|i]\))\s*/g,` ` )
    }
    if ( input_numbers ) {
        result = result.replace( /\s(?=[0-9]+\))/gi,`\n` )
        result = result.replace( /(?<=[0-9]\))\s*/g,` ` )
    }
    if ( input_alphabet ) {
        result = result.replace( /\s(?=[a-z]\))/gi,`\n` )
        result = result.replace( /(?<=[a-z]\))\s*/g,` ` )
    }
    result = result.replace( new RegExp( `\n*${multiNewLineid}\n*`,'g' ),'\n\n' ) //decode more than 2 new line
    domNode.formatted_text.innerHTML = result
    domNode.formatted_text.setAttribute( 'data-result',result )
}

domNode.input_search.addEventListener( 'input',onSearch )
function onSearch ( e ) {
    const value = e.target.value
    let result = domNode.formatted_text.getAttribute( 'data-result' ) || ''
    if ( value.length >= 1 ) {
        let index = 1
        result = result.replace( new RegExp( value,'gi' ),( value ) => `<mark id="mark-${index++}">${value}</mark>` )
        setHtml_Search_Traverse( index - 1,1 )
    }
    domNode.formatted_text.innerHTML = result
}

domNode.button_copy_formatted_text.addEventListener( 'mousedown',onCopyFormattedText )
function onCopyFormattedText () {
    navigator.clipboard.writeText( domNode.formatted_text.getAttribute( 'data-result' ) )
}

function setHtml_Search_Traverse ( total,current ) {
    current = total === 0 ? 0 : current
    let back = current <= 1 ? total : current - 1
    let next = current >= total ? 1 : current + 1
    let html = `
    <a class="btn btn-sm btn-light" href="#mark-${back}"
        onmousedown="setHtml_Search_Traverse(${total},${back})">
        <i class="bi bi-caret-left"></i>
    </a>
    <span>${current}/<b>${total}</b></span>
    <a class="btn btn-sm btn-light" href="#mark-${next}"
        onmousedown="setHtml_Search_Traverse(${total},${next})">
        <i class="bi bi-caret-right"></i>
    </a>
    `
    domNode.search_traverse.innerHTML = html
    if ( document.querySelector( `[id^=mark-].active` ) )
        document.querySelector( `[id^=mark-].active` ).classList.remove( 'active' )
    if ( document.querySelector( `#mark-${current}` ) )
        document.querySelector( `#mark-${current}` ).classList.add( 'active' )
}
