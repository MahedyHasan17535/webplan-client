import { CategoryGrid } from "@/components/home/category-grid"
import { FeaturedServices } from "@/components/home/featured-services"
import { HeroSection } from "@/components/home/hero-section"
import { HowItWorks } from "@/components/home/how-it-works"
import { WhyChoose } from "@/components/home/why-choose"
import { getServiceCategories, getServices } from "@/lib/api"

export default async function Page() {
    // Both calls degrade to empty lists if the API is unreachable.
    const [services, categories] = await Promise.all([
        getServices("limit=6"),
        getServiceCategories(),
    ])

    return (
        <>
            <HeroSection />
            <FeaturedServices services={services} />
            <CategoryGrid counts={categories} />
            <WhyChoose />
            <HowItWorks />
        </>
    )
}