import React, {forwardRef, Ref, useEffect, useImperativeHandle, useState} from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// 导入编辑器的样式
import {upload} from "@/api/v1/public";
// @ts-ignore
import hljs from 'highlight.js/lib/core.js';
// @ts-ignore
import javascript from 'highlight.js/lib/languages/javascript';
// @ts-ignore
import golang from 'highlight.js/lib/languages/go';
// @ts-ignore
import sql from 'highlight.js/lib/languages/sql';

hljs.registerLanguage('js', javascript);
hljs.registerLanguage('go', golang);
hljs.registerLanguage('sql', sql);

import 'react-markdown-editor-lite/lib/index.css';
import './markdownEditor.less';

// 注册插件（如果有的话）
// MdEditor.use(YOUR_PLUGINS_HERE);

// 初始化Markdown解析器
const mdParser: MarkdownIt = new MarkdownIt({
    html: true,
    typographer: true,
    langPrefix: 'lang-',  // 给围栏代码块的 CSS 语言前缀。对于额外的高亮代码非常有用。
    linkify: true,        // 将类似 URL 的文本自动转换为链接。
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="my-high-light-js"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (__) {
            }
        }
        return '<pre class="my-high-light-js"><code>' + mdParser.utils.escapeHtml(str) + '</code></pre>';
    }
});

type CallBackData = {
    text: string
}

const MarkDownEditor = (props: any, ref: Ref<any>) => {
    const [content, setContent] = useState("")

    useImperativeHandle(ref, () => ({
        articleContent: content,
        setArticleContent: (value: string) => {
            setContent(value)
        }
    }))

    useEffect(() => {
        setContent(props.content)
    }, [props.content])

    const handleEditorChange = ({text}: CallBackData) => {
        setContent(text)
    }

    const onImageUpload = (file: File) => {
        console.log(file)
        const formData = new FormData();
        formData.append("file", file)
        console.log(formData.getAll("file"))
        return new Promise(async resolve => {
            const result = await upload(formData)
            resolve(result.url)
        });
    }

    return (
        <MdEditor
            value={content}
            style={{height: "500px", zIndex: 991}}
            canView={{menu: true, md: true, html: true, fullScreen: false, hideMenu: true, both: false}}
            renderHTML={(text) => mdParser.render(text)}
            placeholder={"tips:前50字符为标题,字体大小无影响"}
            onChange={handleEditorChange}
            onImageUpload={(file: File) => onImageUpload(file)}
        />
    )
};

export default forwardRef(MarkDownEditor);