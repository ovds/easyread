import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

// @ts-ignore
function Dropzone(props) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                const text = reader.result
                props.onResult(text)
            }
            reader.readAsText(file)
        })

    }, [])
    const {getRootProps, getInputProps} = useDropzone({onDrop})

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} accept={'text/*'} />
            <p>{"Drag or drop some files here, or click to select files"}</p>
        </div>
    )
}

export default Dropzone