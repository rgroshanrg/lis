const mongoose = require('mongoose');
const Book = require('../../models/book');
const Member = require('../../models/member');

const addMember = async (name, memType) => {
    try {
        let memberCount = await Member.find().count();
        let memid = memberCount + 1;
        let memberSchema = {
            name: name,
            memid: memid,
            type: memType
        }
        let newMember = await new Member(memberSchema).save();
        return "Member Added Successfuly, Member Id: " + String(memid);
    } catch {err} {
        return "Error while adding the Member, please review all the parameters"
    }
}

module.exports = {
    addMember
}