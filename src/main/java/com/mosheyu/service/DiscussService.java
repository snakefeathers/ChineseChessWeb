package com.mosheyu.service;

import com.mosheyu.domain.Discuss;

import java.util.List;

public interface DiscussService {

    public List<Discuss> show(int pageNo);

    public List<Discuss> selectByInviId(String invitationId);


    public List<Discuss> showByUserName(String userName);

    public boolean discussAdd(Discuss discuss);




    public boolean deleteById(String discussId);
}
