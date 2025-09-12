'use client';

import {
  BookOpen,
  Calendar,
  CalendarDays,
  Clock,
  Edit,
  Eye,
  Plus,
  Search,
  Trash2,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const programmes = [
  {
    id: '1',
    date: '2024-02-04',
    topic: 'Walking in Faith',
    time: '10:00 AM',
    status: 'upcoming' as const,
    type: 'sunday' as const,
    theme: 'Faith Journey',
    preacher: 'Pastor John',
  },
  {
    id: '2',
    date: '2024-02-10',
    topic: 'Night of Breakthrough',
    time: '11:00 PM',
    status: 'upcoming' as const,
    type: 'vigil' as const,
    theme: 'Breakthrough',
    preacher: 'Prophet Mary',
  },
  {
    id: '3',
    date: '2024-02-15',
    topic: 'Divine Intervention',
    time: '6:00 PM',
    status: 'upcoming' as const,
    type: 'shilo' as const,
    theme: 'Miracles',
    preacher: 'Evangelist Paul',
  },
  {
    id: '4',
    date: '2024-01-28',
    topic: 'Love Never Fails',
    time: '10:00 AM',
    status: 'past' as const,
    type: 'sunday' as const,
    theme: 'Love',
    preacher: 'Pastor John',
  },
];

const ProgrammeCard = ({ programme }: { programme: any }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sunday':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shilo':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'vigil':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'upcoming'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <Card className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1'>
            <CardTitle className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
              {programme.topic}
            </CardTitle>
            <CardDescription className='text-gray-600 dark:text-gray-400'>
              {programme.theme}
            </CardDescription>
          </div>
          <div className='flex gap-2'>
            <Badge className={getTypeColor(programme.type)}>
              {programme.type.charAt(0).toUpperCase() + programme.type.slice(1)}
            </Badge>
            <Badge className={getStatusColor(programme.status)}>
              {programme.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
          <div className='flex items-center gap-1'>
            <CalendarDays className='h-4 w-4' />
            {new Date(programme.date).toLocaleDateString()}
          </div>
          <div className='flex items-center gap-1'>
            <Clock className='h-4 w-4' />
            {programme.time}
          </div>
          <div className='flex items-center gap-1'>
            <User className='h-4 w-4' />
            {programme.preacher}
          </div>
        </div>

        <div className='flex gap-2'>
          <Button variant='outline' size='sm'>
            <Eye className='h-4 w-4 mr-1' />
            View
          </Button>
          <Button variant='outline' size='sm'>
            <Edit className='h-4 w-4 mr-1' />
            Edit
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='text-red-600 hover:text-red-700'>
            <Trash2 className='h-4 w-4 mr-1' />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ProgrammePage = () => {
  const [activeTab, setActiveTab] = useState<ServiceSections | 'Draft'>(
    'Upcoming'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const router = useRouter();
  const filteredProgrammes = programmes.filter((programme) => {
    const matchesSearch =
      programme.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      programme.theme.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || programme.type === typeFilter;
    const matchesTab =
      activeTab === 'Upcoming'
        ? programme.status === 'upcoming'
        : activeTab === 'Past'
        ? programme.status === 'past'
        : true;

    return matchesSearch && matchesType && matchesTab;
  });

  return (
    <div className='space-y-8 py-6'>
      {/* Header */}
      <button onClick={() => setTypeFilter('all')}>asdfasdf</button>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 '>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
            Programme Management
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Manage church programmes, services, and special events
          </p>
        </div>
        <Button
          onClick={() => router.push('/programme/create')}
          className='bg-blue-600 hover:bg-blue-700 text-white'>
          <Plus className='h-4 w-4 mr-2' />
          Create Programme
        </Button>
      </div>

      {/* Search and Filters */}
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
          <Input
            placeholder='Search programmes by topic or theme...'
            className='pl-10'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
          <CardContent className='px-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  Total Programmes
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                  {programmes.length}
                </p>
              </div>
              <Calendar className='h-8 w-8 text-blue-600' />
            </div>
          </CardContent>
        </Card>

        <Card className='py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
          <CardContent className='px-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  Upcoming
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                  {programmes.filter((p) => p.status === 'upcoming').length}
                </p>
              </div>
              <Clock className='h-8 w-8 text-green-600' />
            </div>
          </CardContent>
        </Card>

        <Card className='py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
          <CardContent className='px-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  This Month
                </p>
                <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                  {
                    programmes.filter((p) => {
                      const programmeDate = new Date(p.date);
                      const now = new Date();
                      return (
                        programmeDate.getMonth() === now.getMonth() &&
                        programmeDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
              <CalendarDays className='h-8 w-8 text-purple-600' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ServiceSections)}>
        <TabsList className='grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800'>
          <TabsTrigger
            value='Current'
            className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700'>
            Current
          </TabsTrigger>
          <TabsTrigger
            value='Upcoming'
            className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700'>
            Upcoming
          </TabsTrigger>
          <TabsTrigger
            value='Past'
            className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700'>
            Past
          </TabsTrigger>
          <TabsTrigger
            value='Draft'
            className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700'>
            Draft
          </TabsTrigger>
        </TabsList>

        <TabsContent value='Current' className='mt-6'>
          <Card className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
            <CardContent className='p-6'>
              <div className='text-center py-12'>
                <Calendar className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                  No Current Programme
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  There are no programmes currently in session.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='Upcoming' className='mt-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredProgrammes.length > 0 ? (
              filteredProgrammes.map((programme) => (
                <ProgrammeCard key={programme.id} programme={programme} />
              ))
            ) : (
              <div className='col-span-full'>
                <Card className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <CardContent className='p-6'>
                    <div className='text-center py-12'>
                      <Calendar className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                        No Upcoming Programmes
                      </h3>
                      <p className='text-gray-600 dark:text-gray-400 mb-4'>
                        {searchTerm || typeFilter !== 'all'
                          ? 'No programmes match your search criteria.'
                          : 'There are no upcoming programmes scheduled.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value='Past' className='mt-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredProgrammes.length > 0 ? (
              filteredProgrammes.map((programme) => (
                <ProgrammeCard key={programme.id} programme={programme} />
              ))
            ) : (
              <div className='col-span-full'>
                <Card className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <CardContent className='p-6'>
                    <div className='text-center py-12'>
                      <BookOpen className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                        No Past Programmes
                      </h3>
                      <p className='text-gray-600 dark:text-gray-400'>
                        {searchTerm || typeFilter !== 'all'
                          ? 'No programmes match your search criteria.'
                          : 'No programmes have been completed yet.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgrammePage;
