import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    resumeId: String,
    title: String,
    userEmail: String,
    userName: String,

    // Personal Detail
    firstName: String,
    lastName: String,
    jobTitle: String,
    address: String,
    phone: String,
    email: String,

    // Summary
    summery: String,

    // Theme
    themeColor: String,

    // Repeatable sections
    experience: [
      {
        title: String,
        companyName: String,
        city: String,
        state: String,
        startDate: String,
        endDate: String,
        currentlyWorking: Boolean,
        workSummery: String,
      },
    ],
    education: [
      {
        universityName: String,
        degree: String,
        major: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    skills: [
      {
        name: String,
        rating: Number,
      },
    ],
  },
  { timestamps: true }
);

// Make the response shape match what the frontend already expects
// (Strapi-style: documentId as the public id)
resumeSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.documentId = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Resume", resumeSchema);