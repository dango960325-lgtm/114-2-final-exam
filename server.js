const express = require('express');

const sqlite3 = require('sqlite3').verbose();

const path = require('path');

const app = express();

const db = new sqlite3.Database(':memory:'); // 為了範例方便，使用記憶體資料庫



// 告訴 Express 伺服器，靜態檔案放在與 server.js 同層的目錄下

app.use(express.static(path.join(__dirname, 'public')));



// 處理根路徑，強制回傳 index.html

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, 'public', 'index.html'));

});



app.use(express.json());



// 初始化資料庫表結構 (簡化版)

db.serialize(() => {
    // 1. 建立表格
    db.run("CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, genre TEXT, author TEXT)");
    db.run("CREATE TABLE borrow_records (id INTEGER PRIMARY KEY AUTOINCREMENT, book_id INTEGER, borrower_name TEXT, borrow_date DATE)");

    const booksData = [
    { id: 1, title: '星際迴響', genre: '小說', author: '亞瑟·克拉克' }, { id: 2, title: '暮色森林', genre: '小說', author: '村上春樹' }, { id: 3, title: '鋼鐵之城', genre: '小說', author: '以撒·艾西莫夫' }, { id: 4, title: '破碎的鏡像', genre: '小說', author: '菲利普·狄克' }, { id: 5, title: '最後的守望者', genre: '小說', author: '喬治·馬丁' },
    { id: 6, title: '無名之書', genre: '小說', author: '卡夫卡' }, { id: 7, title: '回憶的重量', genre: '小說', author: '石黑一雄' }, { id: 8, title: '沉默的島嶼', genre: '小說', author: '東野圭吾' }, { id: 9, title: '獵戶座之戀', genre: '小說', author: '張愛玲' }, { id: 10, title: '深淵之歌', genre: '小說', author: '丹·布朗' },
    { id: 11, title: '宇宙的起源', genre: '科普', author: '史蒂芬·霍金' }, { id: 12, title: '人類大歷史', genre: '科普', author: '哈拉瑞' }, { id: 13, title: '基因的奧秘', genre: '科普', author: '理察·道金斯' }, { id: 14, title: '大腦的機制', genre: '科普', author: '大衛·伊葛門' }, { id: 15, title: '量子物理入門', genre: '科普', author: '費曼' },
    { id: 16, title: '演化的故事', genre: '科普', author: '達爾文' }, { id: 17, title: '氣候變遷', genre: '科普', author: '比爾·蓋茲' }, { id: 18, title: 'AI 的未來', genre: '科普', author: '李開復' }, { id: 19, title: '神經科學', genre: '科普', author: '諾曼·道吉' }, { id: 20, title: '數學之美', genre: '科普', author: '吳軍' },
    { id: 21, title: '從 0 到 1', genre: '商業', author: '彼得·提爾' }, { id: 22, title: '原子習慣', genre: '商業', author: '詹姆斯·克利爾' }, { id: 23, title: '深度工作力', genre: '商業', author: '卡爾·紐波特' }, { id: 24, title: '原則', genre: '商業', author: '瑞·達利歐' }, { id: 25, title: '富爸爸窮爸爸', genre: '商業', author: '羅伯特·清崎' },
    { id: 26, title: '零極限', genre: '商業', author: '修·藍博士' }, { id: 27, title: '獲利世代', genre: '商業', author: '亞歷山大·奧斯瓦爾德' }, { id: 28, title: '行銷管理', genre: '商業', author: '菲利普·科特勒' }, { id: 29, title: '快思慢想', genre: '商業', author: '丹尼爾·康納曼' }, { id: 30, title: '影響力', genre: '商業', author: '羅伯特·席爾迪尼' },
    { id: 31, title: '羅馬帝國衰亡史', genre: '歷史', author: '愛德華·吉本' }, { id: 32, title: '絲綢之路', genre: '歷史', author: '彼得·法蘭科潘' }, { id: 33, title: '槍砲、病菌與鋼鐵', genre: '歷史', author: '賈德·戴蒙' }, { id: 34, title: '明朝那些事兒', genre: '歷史', author: '當年明月' }, { id: 35, title: '大國崛起', genre: '歷史', author: '陳曉卿' },
    { id: 36, title: '中世紀之光', genre: '歷史', author: '雅克·勒高夫' }, { id: 37, title: '十字軍東征', genre: '歷史', author: '湯瑪斯·阿斯布里奇' }, { id: 38, title: '冷戰歷史', genre: '歷史', author: '文安立' }, { id: 39, title: '世界史', genre: '歷史', author: '威廉·麥克尼爾' }, { id: 40, title: '第三帝國', genre: '歷史', author: '威廉·夏伊勒' },
    { id: 41, title: '海賊航路', genre: '漫畫', author: '尾田榮一郎' }, { id: 42, title: '忍者之路', genre: '漫畫', author: '岸本齊史' }, { id: 43, title: '煉金之術', genre: '漫畫', author: '荒川弘' }, { id: 44, title: '巨人崛起', genre: '漫畫', author: '諫山創' }, { id: 45, title: '咒術迴戰', genre: '漫畫', author: '芥見下下' },
    { id: 46, title: '鬼滅之刃', genre: '漫畫', author: '吾峠呼世晴' }, { id: 47, title: '獵人獵殺', genre: '漫畫', author: '富樫義博' }, { id: 48, title: '王者天下', genre: '漫畫', author: '原泰久' }, { id: 49, title: '灌籃高手', genre: '漫畫', author: '井上雄彥' }, { id: 50, title: '死亡筆記', genre: '漫畫', author: '大場鶇' }
    ];

    const stmtBook = db.prepare("INSERT INTO books VALUES (?, ?, ?, ?)");
    booksData.forEach(b => {
        stmtBook.run(b.id, b.title, b.genre, b.author);
    });
    stmtBook.finalize();

    // 定義 20 位借閱者與其行為模式 (類型：專一/多元, 頻率：高/低)
const borrowersConfig = [
    // 5 位「高頻專一」（15-25次，90% 同類型）
    ...Array(5).fill({ freq: 'high', type: 'special' }),
    // 5 位「高頻多元」（15-25次，40% 以下同一類型）
    ...Array(5).fill({ freq: 'high', type: 'diverse' }),
    // 5 位「低頻專一」（3-8次，90% 同類型）
    ...Array(5).fill({ freq: 'low', type: 'special' }),
    // 5 位「低頻多元」（3-8次，40% 以下同一類型）
    ...Array(5).fill({ freq: 'low', type: 'diverse' })
];

const genres = ['小說', '科普', '商業', '歷史', '漫畫'];
const stmtRecord = db.prepare("INSERT INTO borrow_records (book_id, borrower_name, borrow_date) VALUES (?, ?, ?)");

borrowersConfig.forEach((cfg, idx) => {
    const name = `讀者_${idx + 1}`;
    const count = (cfg.freq === 'high') ? (15 + Math.floor(Math.random() * 11)) : (3 + Math.floor(Math.random() * 6));
    const targetGenre = genres[idx % 5]; // 專一者鎖定的目標類型

    for (let i = 0; i < count; i++) {
        let bookId;
        if (cfg.type === 'special') {
            // 90% 機率選該類型的書 (ID 1-10 為小說，11-20 為科普，以此類推)
            if (Math.random() < 0.9) {
                bookId = (idx % 5) * 10 + Math.floor(Math.random() * 10) + 1;
            } else {
                bookId = Math.floor(Math.random() * 50) + 1;
            }
        } else {
            // 多元：隨機挑書，並透過邏輯確保分佈均勻
            bookId = Math.floor(Math.random() * 50) + 1;
        }
        stmtRecord.run(bookId, name, '2026-06-18');
    }
});
stmtRecord.finalize();



    console.log("資料庫已自動初始化完成！");
});



// GET /books - 取得所有書籍

app.get('/books', (req, res) => {

    db.all("SELECT * FROM books", [], (err, rows) => {

        res.json(rows);

    });

});



// GET /borrowers/:name/type - 依決策樹計算借閱者類型

// 決策樹邏輯：總借閱 > 10 為「高頻」，否則為「低頻」；單一類型佔比 > 70% 為「專一」，否則為「多元」

app.get('/borrowers/:name/type', (req, res) => {

    const name = req.params.name;

    const sql = `

        SELECT genre, COUNT(*) as count, total_records

        FROM borrow_records b

        JOIN books bk ON b.book_id = bk.id

        CROSS JOIN (SELECT COUNT(*) as total_records FROM borrow_records WHERE borrower_name = ?)

        WHERE b.borrower_name = ?

        GROUP BY genre

    `;

    db.all(sql, [name, name], (err, rows) => {

        if (err || rows.length === 0) return res.status(404).send("無紀錄");

       

        let maxGenreCount = 0;

        let total = rows[0].total_records;

        rows.forEach(r => { if(r.count > maxGenreCount) maxGenreCount = r.count; });

       

        const ratio = maxGenreCount / total;

        let type = "";

        if (total > 10) {

            type = (ratio >= 0.7) ? "高頻專一型" : "高頻多元型";

        } else {

            type = (ratio >= 0.7) ? "低頻專一型" : "低頻多元型";

        }

        res.json({ name, total, type });

    });

});

// 新增這兩段到 server.js
app.get('/api/books', (req, res) => {
    db.all("SELECT * FROM books", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/borrow_records', (req, res) => {
    // 這裡我們聯表查詢，顯示比較完整的資訊（書籍名稱而非僅 ID）
    const sql = `
        SELECT br.id, b.title, br.borrower_name, br.borrow_date 
        FROM borrow_records br
        JOIN books b ON br.book_id = b.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 這裡放入你剛新增的詳細紀錄 API
app.get('/borrowers/:name/details', (req, res) => {
    const sql = `
        SELECT b.title, b.genre 
        FROM borrow_records br
        JOIN books b ON br.book_id = b.id
        WHERE br.borrower_name = ?
    `;
    db.all(sql, [req.params.name], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});



app.listen(3000, () => console.log('Server running on http://localhost:3000'));