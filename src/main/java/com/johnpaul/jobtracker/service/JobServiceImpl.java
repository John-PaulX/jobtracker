package com.johnpaul.jobtracker.service;


import com.johnpaul.jobtracker.entity.Job;
import com.johnpaul.jobtracker.exception.JobNotFoundException;
import com.johnpaul.jobtracker.repository.JobRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;

    public JobServiceImpl(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Override
    public Job saveJob(Job job) {
        return jobRepository.save(job);
    }

    @Override
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @Override
    public Job getJobById(Long id) {

        return jobRepository.findById(id)
                .orElseThrow(() ->
                        new JobNotFoundException(
                                "Job with id " + id + " not found"
                        ));

    }

    @Override
    public Job updateJob(Long id, Job updatedJob) {

        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() ->
                        new JobNotFoundException("Job with id " + id + " not found"));

        existingJob.setCompany(updatedJob.getCompany());
        existingJob.setRole(updatedJob.getRole());
        existingJob.setLocation(updatedJob.getLocation());
        existingJob.setStatus(updatedJob.getStatus());

        return jobRepository.save(existingJob);
    }

    @Override
    public void deleteJob(Long id) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new JobNotFoundException(
                                "Job with id " + id + " not found"
                        ));

        jobRepository.delete(job);

    }

    @Override
    public Page<Job> getJobs(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        return jobRepository.findAll(pageable);
    }

    @Override
    public List<Job> getJobsByCompany(String company) {
        return jobRepository.findByCompanyContainingIgnoreCase(company);
    }

    @Override
    public List<Job> getJobsByCompanyAndStatus(String company,
                                               String status) {

        return jobRepository.findByCompanyAndStatus(company, status);

    }

}
