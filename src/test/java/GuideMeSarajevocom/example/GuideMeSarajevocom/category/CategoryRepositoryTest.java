package GuideMeSarajevocom.example.GuideMeSarajevocom.category;

import GuideMeSarajevocom.example.GuideMeSarajevocom.Model.Category;
import GuideMeSarajevocom.example.GuideMeSarajevocom.Repository.CategoriesRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class CategoryRepositoryTest {

    @Autowired
    private CategoriesRepository locationCategoryRepository;

    @Test
    public void testFindAllCategories() {
        List<Category> categories = locationCategoryRepository.findAll();
        assertNotNull(categories);
        assertFalse(categories.isEmpty());
    }

    @Test
    public void testFindById() {
        Category category = locationCategoryRepository.findById(1).orElse(null);
        assertNotNull(category);
    }
}
