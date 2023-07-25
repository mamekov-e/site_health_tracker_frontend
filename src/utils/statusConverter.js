export const getGroupStatusMsg = (siteGroup) => {
    if (siteGroup.status === "ALL_DOWN") {
        return "все сайты недоступны";
    } else if (siteGroup.status === "ALL_UP") {
        return "все сайты доступны"
    } else if (siteGroup.status === "PARTIAL_UP") {
        return "не все сайты доступны"
    } else {
        return "нет сайтов"
    }
}

export const getGroupStatusBtnColor = (siteGroup) => {
    if (siteGroup.status === "ALL_DOWN") {
        return "danger";
    } else if (siteGroup.status === "ALL_UP") {
        return "success"
    } else if (siteGroup.status === "PARTIAL_UP") {
        return "warning"
    } else {
        return "secondary"
    }
}