import React, {useState, useEffect} from 'react';
import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js';
import 'draft-js/dist/Draft.css';

const TextEditor = props => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());


    // This enables bolding, italicizing, and underlining text
    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }

        return 'not-handled';
    }

    // We are going to be submitting the notes to the database;
    const handleClick = () => {
        let contentState = editorState.getCurrentContent();
        console.log(contentState);
    }

    
    useEffect(() => {

    }, [])


    return (
        <div>
            <Editor editorState={editorState} onChange={setEditorState} handleKeyCommand={handleKeyCommand} spellCheck={true}  readOnly={true}/>
            <button onClick={() => handleClick()}>Click Me</button>
        </div>
    )
}

export default TextEditor;