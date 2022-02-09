import { useState, useEffect } from 'react';
import { useWebsite } from 'services/website/provider';

const useSEOForm = () => {
    const { website } = useWebsite();
    const [title, setTitle] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [language, setLanguage] = useState('');
    const [robots, setRobots] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (!Object.keys(website).length) return;
        if (!website.seo) return;
        setTitle(website.seo.title);
        setPreviewTitle(website.seo.previewTitle);
        setDescription(website.seo.description);
        setKeywords(website.seo.keywords);

        const languageMap = {
            'EN':'English',
            'EN-GB': 'English - UK',
            'EN-US': 'English - US',
            'ZH': 'Chinese',
            'NL': 'Dutch',
            'FI': 'Finnish',
            'FR': 'French',
            'DE': 'German',
            'IW': 'Hebrew',
            'HI': 'Hindi',
            'IT': 'Italian',
            'JA': 'Japanese',
            'KO': 'Korean',
            'NO': 'Norwegian',
            'PL': 'Polish',
            'PT': 'Portuguese',
            'RO': 'Romanian',
            'RU': 'Russian',
            'ES': 'Spanish',
        };

        setLanguage(website.seo.language ? {label: languageMap[website.seo.language], data: website.seo.language} : {label: "English", data: "EN"});
        setRobots(website.seo.robots ? website.seo.robots : "index, follow");
        setUrl(website.seo.url);
    }, [website])

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const onPreviewTitleChange = (e) => {
        setPreviewTitle(e.target.value);
    }

    const onDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const onKeywordsChange = (e) => {
        setKeywords(e.target.value);
    }

    const onLanguageChange = (e, target) => {
        setLanguage(target);
    }

    const onRobotsChange = (e, target) => {
        setRobots(target);
    }

    const onUrlChange = (e) => {
        setUrl(e.target.value);
    }

    return {
        title,
        onTitleChange,
        previewTitle,
        onPreviewTitleChange,
        description,
        onDescriptionChange,
        keywords,
        onKeywordsChange,
        language,
        onLanguageChange,
        robots,
        onRobotsChange,
        url,
        onUrlChange
    }
}

export default useSEOForm