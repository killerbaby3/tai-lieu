const getInfoDevice = _ => {
    var os = _ => {
        let os = navigator.userAgent;
        let finalOs = "Other";
        if (os.search('Windows')!==-1) 
        {
            finalOs = "Windows";
        }
        else if (os.search('Mac')!==-1) 
        {
            finalOs = "Mac OS X";
        }
        else if (os.search('Android')!==-1) 
        {
            finalOs = "Android"
        }
        else if (os.search('Linux')!==-1) 
        {
            finalOs = "Linux"
        }
        return finalOs;
    }
    var test = (regexp) => {
        return regexp.test(window.navigator.userAgent)
    }
    var browser = _ => {
        switch (true) {
            case test(/edg/i): return "Edge";
            case test(/firefox|fxios/i): return "Firefox";
            case test(/opr\//i): return "Opera";
            case test(/ucbrowser/i): return "UC Browser";
            case test(/samsungbrowser/i): return "Samsung Browser";
            case test(/chrome|chromium|crios/i): return "Chrome";
            case test(/safari/i): return "Safari";
            default: return "Other";
        }
    }
    return {
        'os' : os().toLowerCase(),
        'browser': browser().toLowerCase()
    }
}

const device = getInfoDevice();
console.log("device: ", device);