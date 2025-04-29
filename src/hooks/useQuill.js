import { useEffect, useRef } from "react";
import Quill from "quill";

export default function useQuill(initialHTML = "", options = {}) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const createdRef = useRef(false); // <-- new flag

  useEffect(() => {
    // Only create the instance the first time React mounts the component
    if (!containerRef.current || createdRef.current) return;

    quillRef.current = new Quill(containerRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "code-block"],
        ],
      },
      ...options,
    });

    if (initialHTML) {
      quillRef.current.clipboard.dangerouslyPasteHTML(initialHTML);
    }

    createdRef.current = true;

    return () => {
      // clean container on unmount
      if (containerRef.current) containerRef.current.innerHTML = "";
      quillRef.current = null;
      createdRef.current = false; // reset for a real re-mount
    };
  }, []); // <— still only runs on the first (dev) mount

  const getHTML = () => quillRef.current?.root.innerHTML || "";
  return { containerRef, quill: quillRef, getHTML };
}
