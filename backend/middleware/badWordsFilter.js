


const badWords = ['idiot', 'stupid', 'loser', 'shit']; 

const filterBadWords = (req, res, next) => {
    const { title, body } = req.body;

    if (title || body) {
        const content = `${title || ''} ${body || ''}`.toLowerCase();
        const foundWord = badWords.find(word => content.includes(word));

        if (foundWord) {
            return res.status(400).json({ message: "The post contains abusive word" });
        }
    }
    
    // Agar koi galat word nahi mila, toh request ko aage badha do
    next();
};

module.exports = { filterBadWords };