# AIdol Product Hunt FAQ

Prepared answers for expected Product Hunt comments. Copy-paste ready.

## 1. Competitor Comparisons

### 1.1 "How is this different from Character.ai?"

Character.ai is great for open-ended roleplay with any character you can imagine. AIdol is specifically designed around the K-pop producing experience. You don't just chat — you draft trainees, build a group, design concepts, and watch your idols grow over time. Think of it less as a chatbot and more as a management simulation where the AI characters have depth, personality stats, MBTI types, and evolving chemistry with each other.

### 1.2 "What about Fingerheart? They already do K-pop AI chat."

We love that more people are building for K-pop fans. Fingerheart focuses on chat with existing idol personas. AIdol takes a different approach — you become the producer. You draft from a roster of AI trainees, build your own group from scratch, and shape their journey. It's the difference between talking to a character and running the whole show. We think both can coexist because they serve different fan fantasies.

### 1.3 "There are so many AI chatbot apps. Why should I try another one?"

Fair question. Most AI chatbots are general-purpose tools wearing a character skin. AIdol is built from the ground up around one specific experience: K-pop idol producing. Every feature — the draft system, group chemistry mechanics, seasonal rankings, trainee stats — exists to make you feel like a real producer. If you've ever watched Produce 101 and thought "I could build a better group," this is literally for you.

## 2. Technical Questions

### 2.1 "What AI model are you using under the hood?"

We use a combination of foundation models (including OpenAI's GPT) with our own fine-tuning layer that captures K-pop idol speech patterns, personality consistency, and cultural context. The voice features run on Fish Audio TTS, and we're using LiveKit for real-time interactions. Our CTO Youngwook is a KAIST ML researcher (ex-Naver, ex-Scatter Lab) so the AI architecture is something we obsess over.

### 2.2 "How do you maintain personality consistency across conversations?"

Each AI trainee has a detailed personality profile — MBTI, background story, speech patterns, emotional tendencies, and relationship dynamics with other members. We use a combination of structured prompting and memory systems so your idol remembers past conversations and evolves based on your interactions. It's not perfect yet (we're in early beta), but consistency is our top priority.

### 2.3 "Does it support voice calls? How does that work?"

Yes. We have AI voice chat powered by Fish Audio TTS and LiveKit Agents for real-time interaction. Each trainee has a distinct voice that matches their personality. It's one of the features our beta testers loved most — hearing "your" idol actually talk to you adds a whole different layer to the experience.

## 3. Product Questions

### 3.1 "What K-pop idols are available?"

AIdol doesn't use real idol likenesses. Instead, we have original AI trainees — each with unique names, personalities, stats, MBTI types, and visual styles inspired by K-pop archetypes. Think of it like creating your own group in a K-pop universe rather than chatting with existing idols. This lets us avoid IP issues while giving you full creative freedom as a producer.

### 3.2 "Is it free? What's the pricing?"

We're in early beta right now, so the core experience is free. We're still exploring the right pricing model — likely a freemium approach where basic producing is free, with premium features (extra draft picks, advanced group management, exclusive content) as paid tiers. Your feedback on what's worth paying for genuinely helps us figure this out.

### 3.3 "Is it only in Korean?"

Nope. AIdol supports both English and Korean, and we're seeing organic users from all over the world — Namibia, Kenya, Nigeria, the US. K-pop fandom is global, so we built it to be global from day one. We plan to add more languages based on where our users come from.

### 3.4 "Can I play this on mobile?"

We currently have a web app at aioia.ai that works on mobile browsers. A native app (iOS/Android) is in our roadmap — it's one of our top priorities after this beta phase. We're building with Flutter so both platforms will come together.

## 4. Privacy and Ethics

### 4.1 "Are you using real idol likenesses without permission?"

No. All AI trainees in AIdol are original characters. We deliberately chose not to use real idol names, faces, or voices to avoid IP and ethical issues. Our characters are inspired by K-pop culture and archetypes, but they're entirely our own creations. We respect both idols and the agencies that manage them.

### 4.2 "What about user data and conversations? Is my chat data private?"

Your conversations are private. We don't share individual chat data with third parties or use it for advertising. We do use anonymized, aggregated data to improve the AI experience (like making conversations feel more natural). Standard stuff — we follow GDPR principles and are transparent about what we collect.

## 5. Business Questions

### 5.1 "What's your business model?"

We're exploring a few revenue streams: premium subscriptions for advanced producing features, seasonal content packs, and potentially a B2B API for entertainment companies who want to create their own AI idol experiences. Our immediate focus is nailing the core user experience first. We believe if we make something K-pop fans genuinely love, monetization will follow naturally.

### 5.2 "Are you looking for investment?"

We're in fundraising mode, yes. We're a team of 9 based in Seoul, led by husband-wife co-founders. Our CTO previously built EasyDeep (AI education platform, $700K+ revenue). If you're an investor interested in the intersection of AI and entertainment/culture, we'd love to chat — sylee@aioia.ai.

### 5.3 "What's on your roadmap?"

Near-term: native mobile app (iOS/Android), more AI trainees, enhanced group dynamics and seasonal events. Mid-term: user-generated trainee content, social features (compare groups with friends), and partnerships with entertainment companies. Long-term: we want to be the platform where anyone in the world can experience the magic of K-pop producing — not just watching, but actively creating.
