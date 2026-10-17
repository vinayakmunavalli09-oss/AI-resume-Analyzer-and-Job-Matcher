"""
Unit tests for the deterministic Job Matching and Skill Gap Engine.
"""
import unittest

from app.models.resume import ResumeProfile, Education, Project, Internship
from app.models.job import Job
from app.services import matching_engine


class TestMatchingEngine(unittest.TestCase):
    def setUp(self):
        self.sample_job = Job(
            id="job-test-01",
            title="Junior Python Developer",
            company="TechSolutions India",
            location="Bengaluru, Karnataka",
            description="Entry level role building APIs with Python and FastAPI.",
            role_category="Software Engineering",
            experience_level="fresher",
            work_arrangement="hybrid",
            required_skills=["Python", "FastAPI", "SQL", "Git"],
            preferred_skills=["Docker", "AWS"],
            min_experience_years=0,
            max_experience_years=2,
            education_requirement="bachelor",
            salary_min=450000,
            salary_max=650000,
            salary_currency="INR",
            source="seed",
            is_demo=True,
            source_label="Demo Data",
        )

    def test_strong_match(self):
        profile = ResumeProfile(
            name="Aman Gupta",
            email="aman@example.com",
            education=[Education(degree="B.Tech", field="Computer Science")],
            skills=["Python", "FastAPI", "SQL", "Git", "Docker"],
            projects=[
                Project(
                    name="FastAPI Service",
                    description="REST API using FastAPI, SQL, and Python",
                    technologies=["Python", "FastAPI", "SQL"],
                )
            ],
            internships=[Internship(title="Python Intern", company="StartUp")],
        )
        match = matching_engine.compute_match(profile, self.sample_job, "analysis-1")
        self.assertGreaterEqual(match.overall_score, 80.0)
        self.assertEqual(match.skills_score, 100.0)
        self.assertEqual(match.education_score, 100.0)
        self.assertFalse(match.has_mandatory_failure)
        self.assertIn("Python", match.matched_skills)
        self.assertIn("FastAPI", match.matched_skills)
        self.assertEqual(len(match.missing_required_skills), 0)

    def test_mandatory_eligibility_failure(self):
        # Profile has zero matching required skills
        profile = ResumeProfile(
            name="Pooja Sharma",
            education=[Education(degree="B.Com", field="Accounting")],
            skills=["Tally", "Financial Accounting", "Taxation"],
        )
        match = matching_engine.compute_match(profile, self.sample_job, "analysis-2")
        self.assertEqual(match.skills_score, 0.0)
        self.assertTrue(match.has_mandatory_failure)
        self.assertIn("Python", match.missing_required_skills)
        self.assertIn("⚠", match.explanation)

    def test_fresher_without_internship_history(self):
        # A fresher with no corporate or internship history should still be scored fairly
        fresher_profile = ResumeProfile(
            name="Kiran Kumar",
            education=[Education(degree="B.Tech", field="Information Technology")],
            skills=["Python", "SQL", "Git"],
            projects=[
                Project(
                    name="Student Database System",
                    description="Built using Python and SQL",
                    technologies=["Python", "SQL"],
                )
            ],
            internships=[],  # No internships
        )
        match = matching_engine.compute_match(fresher_profile, self.sample_job, "analysis-3")
        # Fresher experience score should still grant 80-90% for a 0-exp job
        self.assertGreaterEqual(match.experience_score, 80.0)
        self.assertGreaterEqual(match.overall_score, 60.0)
        self.assertFalse(match.has_mandatory_failure)

    def test_weights_sum_to_one(self):
        total_weight = sum(matching_engine.WEIGHTS.values())
        self.assertAlmostEqual(total_weight, 1.0, places=3)

    def test_unknown_education_is_neutral(self):
        profile = ResumeProfile(skills=["Python"], education=[])
        match = matching_engine.compute_match(profile, self.sample_job, "analysis-unknown-education")
        self.assertEqual(match.education_score, 50.0)

    def test_skill_gap_report_generation(self):
        profile = ResumeProfile(
            name="Vikas Rao",
            skills=["Python", "Git"],
            education=[Education(degree="B.Sc", field="Computer Science")],
        )
        match = matching_engine.compute_match(profile, self.sample_job, "analysis-4")
        report = matching_engine.build_skill_gap_report(match, self.sample_job)

        self.assertIn("Python", report.matched_skills)
        missing_req_names = [item.skill for item in report.missing_required]
        self.assertIn("FastAPI", missing_req_names)
        self.assertIn("SQL", missing_req_names)

        missing_pref_names = [item.skill for item in report.missing_preferred]
        self.assertIn("Docker", missing_pref_names)
        self.assertIn("AWS", missing_pref_names)

        self.assertEqual(report.total_required, 4)
        self.assertEqual(report.total_matched, 2)
        self.assertEqual(report.coverage_percent, 50.0)


if __name__ == "__main__":
    unittest.main()
