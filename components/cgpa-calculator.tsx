"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Trash2, Sun } from "lucide-react"

// First, define the UniversityType
type UniversityType = "BRAC/NSU" | "NWU" | "Public" | "US";

type GradeType = {
  [key: string]: number;
};

// Then use it in gradingSystems
const gradingSystems: Record<UniversityType, GradeType> = {
  "BRAC/NSU": { "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0 },
  "NWU": { "A+": 4.0, "A": 3.75, "B+": 3.5, "B": 3.0, "C+": 2.5, "C": 2.25, "D+": 2.0, "D": 1.75, "F": 0.0 },
  "Public": { "A+": 4.0, "A": 3.75, "A-": 3.5, "B+": 3.25, "B": 3.0, "B-": 2.75, "C+": 2.5, "C": 2.25, "D": 2.0, "F": 0.0 },
  "US": { "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0 }
}

interface Course {
  credit: string;
  grade: string;
}

export default function CGPACalculator() {
  const [university, setUniversity] = useState<UniversityType>("NWU")
  const [courses, setCourses] = useState<Course[]>([])
  const [bundleCredit, setBundleCredit] = useState("")
  const [bundleGrade, setBundleGrade] = useState("")
  const [cgpa, setCGPA] = useState(0)
  const [showInitialForm, setShowInitialForm] = useState(true)
  const [courseInputs, setCourseInputs] = useState([
    { count: "", credit: "3" },
    { count: "", credit: "1.5" },
    { count: "", credit: "0.75" }
  ])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isNeomorphic, setIsNeomorphic] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const initializeCourses = () => {
    const newCourses: Course[] = []
    courseInputs.forEach(input => {
      const count = parseInt(input.count) || 0
      const credit = parseFloat(input.credit) || 0
      for (let i = 0; i < count; i++) {
        newCourses.push({ credit: credit.toString(), grade: Object.keys(gradingSystems[university])[0] })
      }
    })
    setCourses(newCourses)
    setShowInitialForm(false)
  }

  const addCourse = () => {
    setCourses([...courses, { credit: "", grade: Object.keys(gradingSystems[university])[0] }])
  }

  const removeCourse = (index: number) => {
    const newCourses = courses.filter((_, i) => i !== index)
    setCourses(newCourses)
  }

  const updateCourse = (index: number, field: "credit" | "grade", value: string) => {
    const newCourses = [...courses]
    newCourses[index][field] = value
    setCourses(newCourses)
  }

  const calculateCGPA = () => {
    let totalCredits = 0
    let totalGradePoints = 0

    courses.forEach(course => {
      if (course.credit && course.grade && course.grade in gradingSystems[university]) {
        const credit = parseFloat(course.credit)
        const gradePoint = gradingSystems[university][course.grade as keyof typeof gradingSystems[UniversityType]]
        totalCredits += credit
        totalGradePoints += credit * gradePoint
      }
    })

    if (bundleCredit && bundleGrade) {
      const credit = parseFloat(bundleCredit)
      const gradePoint = gradingSystems[university][bundleGrade]
      totalCredits += credit
      totalGradePoints += credit * gradePoint
    }

    const calculatedCGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0
    setCGPA(parseFloat(calculatedCGPA.toFixed(2)))
  }

  const cardClasses = `w-full max-w-2xl mx-auto transition-all duration-300 ${
    isNeomorphic
      ? isDarkMode
        ? 'bg-gray-800 shadow-[inset_-12px_-12px_24px_#1f2937,inset_12px_12px_24px_#4b5563]'
        : 'bg-gray-100 shadow-[inset_-12px_-12px_24px_#e5e7eb,inset_12px_12px_24px_#ffffff]'
      : isDarkMode
      ? 'bg-gray-800'
      : 'bg-white'
  } ${isDarkMode ? 'text-white' : 'text-gray-900'}`

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      <Card className={cardClasses}>
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold text-center">CGPA Calculator</CardTitle>
          <div className="absolute right-4 top-4 flex items-center space-x-2">
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              className="data-[state=checked]:bg-gray-600"
            />
            <Sun className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
          </div>
          <div className="absolute left-4 top-4 flex items-center space-x-2">
            <Switch
              checked={isNeomorphic}
              onCheckedChange={setIsNeomorphic}
              className="data-[state=checked]:bg-gray-600"
            />
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Neo</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="university">University Grading System</Label>
              <Select 
                value={university} 
                onValueChange={(value: UniversityType) => setUniversity(value)}
              >
                <SelectTrigger id="university">
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(gradingSystems).map((uni) => (
                    <SelectItem key={uni} value={uni}>
                      {uni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showInitialForm ? (
              <div className="space-y-4">
                {courseInputs.map((input, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder={`Number of ${input.credit} credit courses`}
                      value={input.count}
                      onChange={(e) => {
                        const newInputs = [...courseInputs]
                        newInputs[index].count = e.target.value
                        setCourseInputs(newInputs)
                      }}
                      className="w-2/3"
                    />
                    <Input
                      type="number"
                      value={input.credit}
                      onChange={(e) => {
                        const newInputs = [...courseInputs]
                        newInputs[index].credit = e.target.value
                        setCourseInputs(newInputs)
                      }}
                      className="w-1/3"
                    />
                  </div>
                ))}
                <Button onClick={initializeCourses} className="w-full">Set Up Courses</Button>
              </div>
            ) : (
              <>
                {courses.map((course, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Credits"
                      value={course.credit}
                      onChange={(e) => updateCourse(index, "credit", e.target.value)}
                      className="w-1/3"
                    />
                    <Select value={course.grade} onValueChange={(value) => updateCourse(index, "grade", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(gradingSystems[university]).map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => removeCourse(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button onClick={addCourse} variant="outline" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Course
                </Button>

                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Bundle Credits"
                    value={bundleCredit}
                    onChange={(e) => setBundleCredit(e.target.value)}
                    className="w-1/2"
                  />
                  <Select value={bundleGrade} onValueChange={setBundleGrade}>
                    <SelectTrigger className="w-1/2">
                      <SelectValue placeholder="Bundle Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(gradingSystems[university]).map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateCGPA} className="w-full">Calculate CGPA</Button>

                <div className="text-center text-2xl font-bold">
                  CGPA: {cgpa}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}