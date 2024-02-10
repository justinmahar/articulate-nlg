try{
(()=>{var y=__STORYBOOK_API__,{ActiveTabs:S,Consumer:_,ManagerContext:f,Provider:T,addons:r,combineParameters:v,controlOrMetaKey:O,controlOrMetaSymbol:j,eventMatchesShortcut:x,eventToShortcut:A,isMacLike:M,isShortcutTaken:w,keyToSymbol:P,merge:C,mockChannel:G,optionOrAltSymbol:B,shortcutMatchesShortcut:I,shortcutToHumanString:K,types:N,useAddonState:R,useArgTypes:H,useArgs:Y,useChannel:E,useGlobalTypes:L,useGlobals:D,useParameter:J,useSharedState:V,useStoryPrepared:q,useStorybookApi:U,useStorybookState:W}=__STORYBOOK_API__;var Z=__STORYBOOK_THEMING__,{CacheProvider:$,ClassNames:ee,Global:te,ThemeProvider:oe,background:re,color:se,convert:ae,create:s,createCache:ne,createGlobal:ie,createReset:ce,css:le,darken:pe,ensure:ue,ignoreSsrWarning:de,isPropValid:me,jsx:he,keyframes:ge,lighten:be,styled:ke,themes:ye,typography:Se,useTheme:_e,withTheme:fe}=__STORYBOOK_THEMING__;var a={name:"articulate-nlg",version:"3.0.7",coreVersion:"3.0.9",author:"Justin Mahar <contact@justinmahar.com>",description:"A natural language generator (NLG) that articulates concepts as words, phrases, and sentences.",homepage:"https://justinmahar.github.io/articulate-nlg/",main:"./dist/index.js",types:"./dist/index.d.ts",scripts:{build:"rm -rf ./dist && tsc",test:"jest",start:"npm run storybook",storybook:"storybook dev -p 6006","build-storybook":"storybook build",preship:'npm run build && git diff-index HEAD && npm version patch -m "Build, version, and publish."',ship:"npm publish --access public",postship:"git push",update:"rm -rf .lockblocks && git clone -q git@github.com:justinmahar/react-kindling.git ./.lockblocks && lockblocks ./.lockblocks . --verbose && rm -rf .lockblocks && echo '' && echo ' \u2192 Be sure to run `npm i` to install new dependencies.' && echo ''",postupdate:"node remove-peer-deps.js",example:"node ./dist/example.js"},license:"MIT",repository:{type:"git",url:"git+https://github.com/justinmahar/articulate-nlg.git"},bugs:{url:"https://github.com/justinmahar/articulate-nlg/issues"},keywords:["articulate","nlg","nlp","natural","language","generation","generator","processing","speech","concept","articulation","chatbot","chat","bot","game","npc","interaction","dialog","dialogue"],dependencies:{"random-seed-weighted-chooser":"^1.1.1"},devDependencies:{"@storybook/addon-docs":"^7.6.12","@storybook/addon-essentials":"^7.6.12","@storybook/addon-viewport":"^7.6.12","@storybook/blocks":"^7.6.12","@storybook/react":"^7.6.12","@storybook/react-webpack5":"^7.6.12","@types/jest":"^29.5.12","@types/react":"^18.2.53","@typescript-eslint/eslint-plugin":"^6.20.0","@typescript-eslint/parser":"^6.20.0",eslint:"^8.56.0","eslint-config-prettier":"^9.1.0","eslint-plugin-prettier":"^5.1.3","eslint-plugin-react":"^7.33.2","eslint-plugin-react-hooks":"^4.6.0","eslint-plugin-storybook":"^0.6.15",jest:"^29.7.0",lockblocks:"^1.1.8",prettier:"^3.2.5",react:"^18.2.0","react-dom":"^18.2.0","react-html-props":"^2.0.3","react-markdown":"^8.0.3","remark-gfm":"^3.0.1","replace-in-file":"^7.1.0",storybook:"^7.6.12","ts-jest":"^29.1.2",typescript:"^5.3.3",webpack:"^5.90.1"}};var c="Articulate NLG",l=a.homepage,p="light",u=void 0,n=s({base:p,brandTitle:c,brandUrl:l,brandImage:u});r.setConfig({theme:n});})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }