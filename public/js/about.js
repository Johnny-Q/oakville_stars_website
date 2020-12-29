let team_container = document.querySelector("div.team_members_container");
async function renderTeamCard(team_member) {
    let team_member_div = createElement("div", ["team_member"]);
    let img = createElement("div", ["img"]);
    let img_url = await storage_wrapper.getImage(team_member.image_url);
    img.style.background = `url('${img_url}') no-repeat`;
    img.style["background-size"] = "cover";
    img.style["background-positon"] = "center";
    let name = createElement("h3", [], team_member.name);
    team_member_div.append(img, name);
    team_container.append(team_member_div);
}
window.onload = async () => {
    let team = await db_wrapper.getTeamMembers();
    console.log(team);
    for (let i = 0; i < team.length; i++) {
        await renderTeamCard(team[i]);
    }
};
