"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import StudentForm from '@/components/students/student-form';
import StudentList from '@/components/students/student-list';
import { useToast } from '@/components/ui/use-toast';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:8787/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Students</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <StudentList students={students} onUpdate={fetchStudents} />
      <StudentForm 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false);
          fetchStudents();
        }}
      />
    </div>
  );
}