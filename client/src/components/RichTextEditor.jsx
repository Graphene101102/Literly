import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder, disabled, className }) => {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  const checkFormats = () => {
    if (disabled) return;
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline')
    });
  };

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    checkFormats();
  };

  const formatDoc = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current.focus();
    handleInput();
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white flex flex-col ${className || ''} ${disabled ? 'opacity-70 pointer-events-none' : ''}`}>
      {/* Toolbar */}
      {!disabled && (
        <div className="flex items-center space-x-1 border-b border-gray-200 p-2 bg-gray-50">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); formatDoc('bold'); }}
            className={`p-1.5 rounded transition-colors ${activeFormats.bold ? 'bg-blue-200 text-blue-800 shadow-inner' : 'hover:bg-gray-200 text-gray-700'}`}
            title="In đậm"
          >
            <Bold size={18} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); formatDoc('italic'); }}
            className={`p-1.5 rounded transition-colors ${activeFormats.italic ? 'bg-blue-200 text-blue-800 shadow-inner' : 'hover:bg-gray-200 text-gray-700'}`}
            title="In nghiêng"
          >
            <Italic size={18} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); formatDoc('underline'); }}
            className={`p-1.5 rounded transition-colors ${activeFormats.underline ? 'bg-blue-200 text-blue-800 shadow-inner' : 'hover:bg-gray-200 text-gray-700'}`}
            title="Gạch chân"
          >
            <Underline size={18} />
          </button>
        </div>
      )}
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onBlur={handleInput}
        onKeyUp={checkFormats}
        onMouseUp={checkFormats}
        className="w-full p-4 min-h-[150px] outline-none overflow-y-auto"
        placeholder={placeholder}
        style={{ emptyCells: 'show' }}
      />
      {/* CSS for placeholder hack since contentEditable doesn't support native placeholder well */}
      <style>{`
        div[contenteditable]:empty:before {
          content: attr(placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block; /* For Firefox */
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
