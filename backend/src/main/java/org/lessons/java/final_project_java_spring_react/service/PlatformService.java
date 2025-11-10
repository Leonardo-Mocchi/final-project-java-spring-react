package org.lessons.java.final_project_java_spring_react.service;

import org.lessons.java.final_project_java_spring_react.model.Platform;
import org.lessons.java.final_project_java_spring_react.repository.PlatformRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlatformService {

    @Autowired
    private PlatformRepository platformRepository;

    public List<Platform> findAll() {
        return platformRepository.findAll();
    }

    public List<Platform> findAllSortedByName() {
        return platformRepository.findAll(Sort.by("name"));
    }

    public Optional<Platform> findById(Long id) {
        return platformRepository.findById(id);
    }

    public Platform getById(Long id) {
        Optional<Platform> platformAttempt = platformRepository.findById(id);

        if (platformAttempt.isEmpty()) {
            // throw new NotFoundException();
        }

        return platformAttempt.get();
    }

    public Platform create(Platform platform) {
        return platformRepository.save(platform);
    }

    public Platform update(Platform platform) {
        return platformRepository.save(platform);
    }

    public void delete(Platform platform) {
        platformRepository.delete(platform);
    }

    public void deleteById(Long id) {
        platformRepository.deleteById(id);
    }

    public Boolean existsById(Long id) {
        return platformRepository.existsById(id);
    }

    public Boolean exists(Platform platform) {
        return existsById(platform.getId());
    }
}
