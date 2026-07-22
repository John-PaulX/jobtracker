package com.johnpaul.jobtracker.service;


import com.johnpaul.jobtracker.entity.Job;
import org.springframework.data.domain.Page;

import java.util.List;


public interface JobService {
    Job saveJob(Job job);

    List<Job> getAllJobs();

    Job getJobById(Long id);

    Job updateJob(Long id, Job job);

    void deleteJob(Long id);

    Page<Job> getJobs(int page, int size);

    List<Job> getJobsByCompany(String company);

    List<Job> getJobsByCompanyAndStatus(String company, String status);

}
