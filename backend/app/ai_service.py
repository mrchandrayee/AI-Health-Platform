import openai
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from typing import Dict, List, Any, Optional
import json
from .config import OPENAI_API_KEY

openai.api_key = OPENAI_API_KEY

class AIService:
    def __init__(self):
        self.llm = OpenAI(temperature=0.7, openai_api_key=OPENAI_API_KEY)
        self.embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
        
    async def generate_nutrition_plan(self, user_profile: Dict[str, Any], request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate personalized nutrition plan using AI"""
        
        # Construct context for AI
        context = self._build_nutrition_context(user_profile, request_data)
        
        # Create prompt template
        nutrition_prompt = PromptTemplate(
            input_variables=["context", "user_profile", "requirements"],
            template="""
            You are an expert nutritionist creating a personalized meal plan. 
            
            User Profile: {user_profile}
            Requirements: {requirements}
            Context: {context}
            
            Create a detailed {duration_days}-day meal plan that:
            1. Meets the user's caloric and macro needs
            2. Respects dietary preferences and allergies
            3. Incorporates cultural and regional food preferences
            4. Follows evidence-based nutrition guidelines (USDA, NHS, WHO)
            5. Provides practical meal preparation instructions
            
            Return the response as a JSON object with the following structure:
            {{
                "title": "Plan title",
                "description": "Plan description",
                "daily_plans": [
                    {{
                        "day": 1,
                        "meals": [
                            {{
                                "meal_type": "breakfast|lunch|dinner|snack",
                                "items": [
                                    {{
                                        "food_name": "Food name",
                                        "quantity": 100,
                                        "unit": "g|ml|piece",
                                        "calories": 200,
                                        "macros": {{"protein": 10, "carbs": 30, "fat": 8, "fiber": 5}}
                                    }}
                                ],
                                "total_calories": 200,
                                "total_macros": {{"protein": 10, "carbs": 30, "fat": 8, "fiber": 5}},
                                "preparation_time": 15,
                                "instructions": "Cooking instructions"
                            }}
                        ],
                        "daily_totals": {{"calories": 2000, "protein": 150, "carbs": 200, "fat": 80, "fiber": 25}}
                    }}
                ],
                "nutritional_summary": {{
                    "avg_daily_calories": 2000,
                    "avg_daily_macros": {{"protein": 150, "carbs": 200, "fat": 80, "fiber": 25}},
                    "key_nutrients": ["vitamin_c", "iron", "calcium"],
                    "health_benefits": ["Weight management", "Heart health"]
                }}
            }}
            """
        )
        
        # Generate the plan
        chain = LLMChain(llm=self.llm, prompt=nutrition_prompt)
        response = await chain.arun(
            context=context,
            user_profile=json.dumps(user_profile),
            requirements=json.dumps(request_data),
            duration_days=request_data.get('duration_days', 7)
        )
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            # Fallback to structured response if JSON parsing fails
            return self._create_fallback_nutrition_plan(user_profile, request_data)
    
    async def generate_fitness_plan(self, user_profile: Dict[str, Any], request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate personalized fitness plan using AI"""
        
        context = self._build_fitness_context(user_profile, request_data)
        
        fitness_prompt = PromptTemplate(
            input_variables=["context", "user_profile", "requirements"],
            template="""
            You are an expert fitness trainer creating a personalized workout plan.
            
            User Profile: {user_profile}
            Requirements: {requirements}
            Context: {context}
            
            Create a detailed workout plan that:
            1. Matches the user's fitness level and goals
            2. Accommodates available equipment and time constraints
            3. Considers any medical conditions or mobility issues
            4. Follows evidence-based exercise principles (ACSM, WHO guidelines)
            5. Includes progressive overload and recovery periods
            6. Adapts to mood, fatigue, and injury status
            
            Return the response as a JSON object with the following structure:
            {{
                "title": "Plan title",
                "description": "Plan description",
                "workout_sessions": [
                    {{
                        "day": 1,
                        "session_type": "strength|cardio|flexibility|recovery",
                        "exercises": [
                            {{
                                "name": "Exercise name",
                                "sets": 3,
                                "reps": 10,
                                "duration": 30,
                                "rest_time": 60,
                                "weight": 10.0,
                                "notes": "Form cues and tips",
                                "modifications": ["easier version", "harder version"]
                            }}
                        ],
                        "estimated_duration": 45,
                        "difficulty_level": "beginner|intermediate|advanced",
                        "warm_up": ["5 min light cardio", "dynamic stretching"],
                        "cool_down": ["static stretching", "breathing exercises"]
                    }}
                ],
                "weekly_structure": {{
                    "frequency": 3,
                    "rest_days": [3, 6, 7],
                    "progression_notes": "How to progress each week"
                }}
            }}
            """
        )
        
        chain = LLMChain(llm=self.llm, prompt=fitness_prompt)
        response = await chain.arun(
            context=context,
            user_profile=json.dumps(user_profile),
            requirements=json.dumps(request_data)
        )
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return self._create_fallback_fitness_plan(user_profile, request_data)
    
    async def suggest_ingredient_substitutions(self, ingredient: str, dietary_restrictions: List[str], cultural_preferences: str) -> List[Dict[str, str]]:
        """Suggest ingredient substitutions based on dietary needs"""
        
        substitution_prompt = PromptTemplate(
            input_variables=["ingredient", "restrictions", "cultural_preferences"],
            template="""
            Suggest healthy ingredient substitutions for: {ingredient}
            
            Dietary restrictions: {restrictions}
            Cultural preferences: {cultural_preferences}
            
            Provide 3-5 alternatives that:
            1. Maintain similar nutritional value
            2. Respect dietary restrictions
            3. Align with cultural preferences
            4. Are readily available
            
            Return as JSON array:
            [
                {{
                    "substitute": "Alternative ingredient",
                    "reason": "Why it's a good substitute",
                    "nutritional_benefit": "Key nutritional advantage",
                    "cultural_note": "Cultural relevance if applicable"
                }}
            ]
            """
        )
        
        chain = LLMChain(llm=self.llm, prompt=substitution_prompt)
        response = await chain.arun(
            ingredient=ingredient,
            restrictions=", ".join(dietary_restrictions),
            cultural_preferences=cultural_preferences
        )
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return [{"substitute": "Consult nutritionist", "reason": "Unable to process request", "nutritional_benefit": "N/A", "cultural_note": "N/A"}]
    
    async def curate_educational_content(self, topic: str, target_audience: List[str], sources: List[str]) -> Dict[str, Any]:
        """Curate educational content on health topics"""
        
        education_prompt = PromptTemplate(
            input_variables=["topic", "audience", "sources"],
            template="""
            Create educational content about: {topic}
            
            Target audience: {audience}
            Evidence sources: {sources}
            
            Create comprehensive yet accessible content that:
            1. Is scientifically accurate and evidence-based
            2. Is appropriate for the target audience level
            3. Includes practical actionable advice
            4. References credible health organizations
            5. Is culturally sensitive and inclusive
            
            Return as JSON:
            {{
                "title": "Article title",
                "summary": "Brief summary (2-3 sentences)",
                "content": "Full article content with sections",
                "key_takeaways": ["Point 1", "Point 2", "Point 3"],
                "evidence_level": "high|medium|low",
                "sources_cited": ["Source 1", "Source 2"],
                "tags": ["tag1", "tag2", "tag3"],
                "related_topics": ["topic1", "topic2"]
            }}
            """
        )
        
        chain = LLMChain(llm=self.llm, prompt=education_prompt)
        response = await chain.arun(
            topic=topic,
            audience=", ".join(target_audience),
            sources=", ".join(sources)
        )
        
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {"title": topic, "summary": "Content creation in progress", "content": "Please check back later", "key_takeaways": [], "evidence_level": "medium", "sources_cited": sources, "tags": [topic], "related_topics": []}
    
    def _build_nutrition_context(self, user_profile: Dict[str, Any], request_data: Dict[str, Any]) -> str:
        """Build context for nutrition AI prompts"""
        context_parts = []
        
        # Add relevant nutrition guidelines
        context_parts.append("NUTRITION GUIDELINES:")
        context_parts.append("- USDA Dietary Guidelines: Emphasize fruits, vegetables, whole grains, lean proteins")
        context_parts.append("- NHS Eat Well Guide: Balance energy intake with physical activity")
        context_parts.append("- WHO Healthy Diet: Limit free sugars, saturated fats, and sodium")
        
        # Add cultural considerations
        if user_profile.get('cultural_background'):
            context_parts.append(f"CULTURAL CONTEXT: Consider {user_profile['cultural_background']} cuisine traditions")
        
        # Add medical considerations
        if user_profile.get('medical_conditions'):
            context_parts.append(f"MEDICAL CONSIDERATIONS: Account for {', '.join(user_profile['medical_conditions'])}")
        
        return "\n".join(context_parts)
    
    def _build_fitness_context(self, user_profile: Dict[str, Any], request_data: Dict[str, Any]) -> str:
        """Build context for fitness AI prompts"""
        context_parts = []
        
        # Add fitness guidelines
        context_parts.append("FITNESS GUIDELINES:")
        context_parts.append("- ACSM Guidelines: 150 min moderate or 75 min vigorous activity per week")
        context_parts.append("- WHO Physical Activity: Include muscle-strengthening activities 2+ days/week")
        context_parts.append("- Progressive overload principle for strength gains")
        
        # Add safety considerations
        if user_profile.get('medical_conditions') or user_profile.get('mobility_issues'):
            context_parts.append("SAFETY CONSIDERATIONS: Prioritize low-impact, modified exercises")
        
        return "\n".join(context_parts)
    
    def _create_fallback_nutrition_plan(self, user_profile: Dict[str, Any], request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a basic nutrition plan when AI generation fails"""
        return {
            "title": "Basic Nutrition Plan",
            "description": "A simple, balanced meal plan",
            "daily_plans": [
                {
                    "day": 1,
                    "meals": [
                        {
                            "meal_type": "breakfast",
                            "items": [
                                {"food_name": "Oatmeal", "quantity": 50, "unit": "g", "calories": 190, "macros": {"protein": 6, "carbs": 35, "fat": 3, "fiber": 4}},
                                {"food_name": "Banana", "quantity": 120, "unit": "g", "calories": 105, "macros": {"protein": 1, "carbs": 27, "fat": 0, "fiber": 3}}
                            ],
                            "total_calories": 295,
                            "total_macros": {"protein": 7, "carbs": 62, "fat": 3, "fiber": 7},
                            "preparation_time": 10,
                            "instructions": "Cook oatmeal with water, add sliced banana"
                        }
                    ],
                    "daily_totals": {"calories": 1800, "protein": 120, "carbs": 200, "fat": 60, "fiber": 25}
                }
            ],
            "nutritional_summary": {
                "avg_daily_calories": 1800,
                "avg_daily_macros": {"protein": 120, "carbs": 200, "fat": 60, "fiber": 25},
                "key_nutrients": ["protein", "fiber", "complex_carbs"],
                "health_benefits": ["Balanced nutrition", "Sustained energy"]
            }
        }
    
    def _create_fallback_fitness_plan(self, user_profile: Dict[str, Any], request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a basic fitness plan when AI generation fails"""
        return {
            "title": "Basic Fitness Plan",
            "description": "A simple, beginner-friendly workout routine",
            "workout_sessions": [
                {
                    "day": 1,
                    "session_type": "strength",
                    "exercises": [
                        {
                            "name": "Bodyweight Squats",
                            "sets": 3,
                            "reps": 10,
                            "duration": None,
                            "rest_time": 60,
                            "weight": None,
                            "notes": "Keep chest up, knees behind toes",
                            "modifications": ["Chair-assisted squats", "Jump squats"]
                        },
                        {
                            "name": "Push-ups",
                            "sets": 3,
                            "reps": 8,
                            "duration": None,
                            "rest_time": 60,
                            "weight": None,
                            "notes": "Full body in straight line",
                            "modifications": ["Knee push-ups", "Decline push-ups"]
                        }
                    ],
                    "estimated_duration": 30,
                    "difficulty_level": "beginner",
                    "warm_up": ["5 min marching in place", "arm circles"],
                    "cool_down": ["stretching", "deep breathing"]
                }
            ],
            "weekly_structure": {
                "frequency": 3,
                "rest_days": [2, 4, 6, 7],
                "progression_notes": "Increase reps by 2 each week"
            }
        }

# Create singleton instance
ai_service = AIService()
