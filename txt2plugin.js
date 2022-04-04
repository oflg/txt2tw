const fs = require("fs");
const path = require('path');

function mkdir(dirpath, dirname) {
    if (typeof dirname === "undefined") {
        if (fs.existsSync(dirpath)) {
            return;
        } else {
            mkdir(dirpath, path.dirname(dirpath));
        }
    } else {
        if (dirname !== path.dirname(dirpath)) {
            mkdir(dirpath);
            return;
        }
        if (fs.existsSync(dirname)) {
            fs.mkdirSync(dirpath);
        } else {
            mkdir(dirname, path.dirname(dirname));
            fs.mkdirSync(dirpath);
        }
    }
}


var booksPath = path.join(__dirname, '/books/');
var bookListsPath = path.join(__dirname, './');
var pluginsPath = path.join(__dirname, '../plugins/oflg/');


var books = fs.readdirSync(booksPath);

for (var bn = 0; bn < books.length; bn++) {

    console.log(books[bn]);

    var bookName = books[bn].replace(".txt", "");


    var bookListsdata = fs.readFileSync(bookListsPath + 'bookLists.json', 'utf8');

    // parse JSON string to JSON object
    var bookListsJson = JSON.parse(bookListsdata);

    bookInfoArry = bookListsJson.data.normalBooksInfo;

    var filterArry = bookInfoArry.filter(function (bi) {
        return bi.id === bookName;
    });

    bookInfoArry = filterArry[0];

    var pluginInfo = `{
    "title": "$:/plugins/oflg/fishing-cannedfish-${bookName}",
    "author": "oflg",
    "core-version": ">=5.2.2",
    "description": "${bookInfoArry.title}",
    "list": "readme",
    "name": "学习包",
    "plugin-type": "plugin",
    "source": "https://github.com/oflg/fishing-manual",
    "version": "0.1.0"
}`;

    var readme = `[img height=200 [${bookInfoArry.cover}]]

此学习包共有 ${bookInfoArry.wordNum} 个来源于${bookInfoArry.bookOrigin.originName}的单词。${bookInfoArry.introduce}

可在[[墨屉手册|https://tiddlymemo.org/manual/zh-Hans]]查看安装使用教程。`;

    var readmeMeta = `title: $:/plugins/oflg/fishing-cannedfish-${bookName}/readme
type: text/vnd.tiddlywiki`;

    var caption = `title: $:/plugins/oflg/fishing-cannedfish-${bookName}/Word

<style>
    .wordtip svg {
        width: 1em; height: 1em; vertical-align: middle;
    }
</style>

{{!!word}}<$reveal
    default={{!!picture}}
    type="nomatch"
    text=""
    animate="yes"
>
<br><img src={{!!picture}} style="height:100px;">
</$reveal>
<$reveal
    state=<<folded-state>>
    type="nomatch"
    text="hide"
    animate="yes"
>
    <div
        class="tc-tiddler-body"
    >

        <div
            style="display:flex;justify-content:space-between;align-items:center;"
        >
        ^^英 {{!!ukphone}} <audio controls style="width:100px;height:12px;">
                            <source
                                src={{{[[https://dict.youdao.com/dictvoice?type=1&audio=]addsuffix{!!word}]}}}
                                type="audio/mpeg"
                            >
                            您的浏览器不支持 audio 元素。
                        </audio>^^

        ^^美 {{!!usphone}} <audio controls style="width:100px;height:12px;">
                            <source
                                src={{{[[https://dict.youdao.com/dictvoice?type=2&audio=]addsuffix{!!word}]}}}
                                type="audio/mpeg"
                            >
                            您的浏览器不支持 audio 元素。
                        </audio>^^
        </div>

        {{!!transCn}}

        <$reveal
            default={{!!remMethod}}
            type="nomatch"
            text=""
            animate="yes"
            class="wordtip"
        >

            {{$:/core/images/tip}} {{!!remMethod}}
        </$reveal>
        <$reveal
            default={{!!realExamSentences}}
            type="nomatch"
            text=""
            animate="yes"
        >
            <details>
                <summary>真题</summary>
                <p>{{!!realExamSentences}}</p>
            </details>
        </$reveal>
        <$reveal
            default={{!!relWords}}
            type="nomatch"
            text=""
            animate="yes"
        >
            <details>
                <summary>同根</summary>
                <p>{{!!relWords}}</p>
            </details>
        </$reveal>
        <$reveal
            default={{!!synos}}
            type="nomatch"
            text=""
            animate="yes"
        >
            <details>
                <summary>同近</summary>
                <p>{{!!synos}}</p>
            </details>
        </$reveal>
        <$reveal
            default={{!!phrases}}
            type="nomatch"
            text=""
            animate="yes"
        >
            <details>
                <summary>短语</summary>
                <p>{{!!phrases}}</p>
            </details>
        </$reveal>
        <$reveal
            default={{!!sentences}}
            type="nomatch"
            text=""
            animate="yes"
        >
            <details>
            <summary>例句</summary>
            <p>{{!!sentences}}</p>
            </details>
        </$reveal>
    </div>
</$reveal>`;

    var fishingrod = `title: $:/plugins/oflg/fishing/fishingrod/[[$:/plugins/oflg/fishing-cannedfish-${bookName}]plugintiddlers[]tag[?]]
caption: ${bookInfoArry.title}`;

    mkdir(pluginsPath + "/fishing-cannedfish-" + bookName + "/words");

    fs.writeFile(pluginsPath + "/fishing-cannedfish-" + bookName + "/plugin.info", pluginInfo, err => {
        if (err) {
            return console.log(err);
        }
    });

    fs.writeFile(pluginsPath + "/fishing-cannedfish-" + bookName + "/REDAME.meta", readmeMeta, err => {
        if (err) {
            return console.log(err);
        }
    });

    fs.writeFile(pluginsPath + "/fishing-cannedfish-" + bookName + "/REDAME", readme, err => {
        if (err) {
            return console.log(err);
        }
    });

    fs.writeFile(pluginsPath + "/fishing-cannedfish-" + bookName + "/Word" + ".tid", caption, err => {
        if (err) {
            return console.log(err);
        }
    });

    fs.writeFile(pluginsPath + "/fishing-cannedfish-" + bookName + "/fishingrod" + ".tid", fishingrod, err => {
        if (err) {
            return console.log(err);
        }
    });

    var linesData = fs.readFileSync(booksPath + bookName + ".txt", 'UTF-8');

    var lines = linesData.split(/\r?\n/);

    // console.log(lines.length);

    for (var li = 0; li < lines.length - 1; li++) {

        var line = lines[li];
        // console.log(`🚀 ~ line${li}: line`);


        // console.log(line);

        var wordObject = JSON.parse(line).content.word;

        var word = wordObject.wordHead,
            title = "$:/" + bookName + "/" + word + "_" + wordObject.wordId.split("_").slice(-1)[0],
            created = new Date().toISOString().replace(/\-|T|:|\.|Z/g, "");

        var content = wordObject.content;

        var transCn = '';

        for (var ti = 0; ti < content.trans.length; ti++) {

            var tran = content.trans[ti];

            if (tran.pos) {
                transCn += "<b>" + tran.pos + ".</b> ";
            }

            transCn += tran.tranCn + "<br>";
        }

        var tid = `title: ${title}
word: ${word}
tags: ?
caption: {{||$:/plugins/oflg/fishing-cannedfish-${bookName}/Word}}
created: ${created}
transCn: ${transCn}
`;

        if ("ukphone" in content) {
            var ukphone = content.ukphone;
            tid = tid + `usphone: ${ukphone}
`;
        }

        if ("usphone" in content) {
            var usphone = content.usphone;
            tid = tid + `usphone: ${usphone}
`;
        }

        if ("remMethod" in content) {
            var remMethod = content.remMethod.val;
            tid = tid + `remMethod: ${remMethod}
`;
        }

        if ("picture" in content) {
            var picture = content.picture;
            tid = tid + `picture: ${picture}
`;
        }

        if ("phrase" in content) {
            var phrases = '';

            for (var pi = 0; pi < content.phrase.phrases.length; pi++) {

                var phrase = content.phrase.phrases[pi];

                phrases += phrase.pContent + ": " + phrase.pCn + "<br>";

            }
            tid = tid + `phrases: ${phrases}
`;
        }

        if ("sentence" in content) {

            var sentences = '';

            for (var si = 0; si < content.sentence.sentences.length; si++) {

                var sentence = content.sentence.sentences[si];

                sentences += sentence.sContent + "<br>^^" + sentence.sCn + "^^<br>";

            }
            tid = tid + `sentences: ${sentences}
`;
        }

        if ("relWord" in content) {
            var relWords = '';

            for (var ri = 0; ri < content.relWord.rels.length; ri++) {

                var relword = content.relWord.rels[ri];

                var words = '';

                if (relword.pos) {
                    words += "<b>" + relword.pos + ".</b><br>";
                }

                for (var wj = 0; wj < relword.words.length; wj++) {

                    var w = relword.words[wj];

                    words += w.hwd + ": " + w.tran + "<br>";
                }

                relWords += words + "<br>";

            }
            tid = tid + `relWords: ${relWords}
`;
        }


        if ("syno" in content) {
            var synos = '';

            for (var syi = 0; syi < content.syno.synos.length; syi++) {

                var syno = content.syno.synos[syi];

                var hwds = [];



                for (var hj = 0; hj < syno.hwds.length; hj++) {

                    var hw = syno.hwds[hj];
                    hwds.push(hw.w);

                }

                var hwdsstr = hwds.join(', ');

                if (syno.pos) {
                    syno.tran = "<b>" + syno.pos + ".</b><br>" + syno.tran;
                }

                synos += syno.tran + "：" + hwdsstr + "<br>";

            }
            tid = tid + `synos: ${synos}
`;
        }

        if ("realExamSentence" in content) {

            var realExamSentences = '';

            for (var rei = 0; rei < content.realExamSentence.sentences.length; rei++) {

                var realexamsentence = content.realExamSentence.sentences[rei];

                realExamSentences += realexamsentence.sContent + "<br>^^" + realexamsentence.sourceInfo.year + " " + realexamsentence.sourceInfo.level + " " + realexamsentence.sourceInfo.paper + " " + realexamsentence.sourceInfo.type + "^^<br>";
            }
            tid = tid + `realExamSentences: ${realExamSentences}
`;
        }

        fs.writeFile(pluginsPath + "fishing-cannedfish-" + bookName + "/words/" + wordObject.wordId + ".tid", tid, err => {
            if (err) {
                return console.log(err);
            }
        });

    }

}

